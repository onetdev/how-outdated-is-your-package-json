import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { NoiseFunction2D, createNoise2D } from 'simplex-noise';

import appConfig from '@/config';
import * as Vec from '@/utils/vector2';
import useColorScheme from '@/hooks/useColorScheme';
import useLogger from '@/hooks/useLogger';

import styles from './AnimatedBackground.module.css';

type PathDescriptor = {
  points: Vec.Vector2[];
  noise: NoiseFunction2D;
};
type InterpolatedPathDescriptor = PathDescriptor & {
  points: Vec.Vector2[];
  segments: Vec.Vector2[][];
  lerps: Vec.Vector2[];
};
type RenderStats = {
  delta: number;
  elapsed: number;
  frameCount: number;
};

const avg = (items: number[]) =>
  items.reduce((a, b) => a + b, 0) / items.length;
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const AnimatedBackground: FunctionComponent = () => {
  const logger = useLogger({ scope: 'AnimatedBackground' });
  const colorScheme = useColorScheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameDeltaHistory, setFrameDeltaHistory] = useState<number[]>([]);
  const canvasCtx = useMemo(
    () => canvasRef.current?.getContext('2d'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canvasRef.current],
  );

  const config = useMemo(
    () => ({
      height: canvasRef.current?.height || 1,
      width: canvasRef.current?.width || 1,
      scale: (canvasRef.current?.width || 1) / 100,
      resolution: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      frameDecay: 0.65, // [0,1]
      aurora: {
        distanceHeightFactor: 0.6, // [0-1]
        lerpSteps: 150, // number of stripes rendered on a curve (regardless of its length)
        noiseAmplitude: 0.001, // affects core noise speed and range
        opacityNoiseFactor: 4, // [0,100]
        wiggleAmplitude: 20, // [0,∞] range of wobble
      },
      star: {
        flickerDepth: 1.5,
        limit: 1000,
      },
    }),
    [],
  );

  const starConfig: {
    flickerRate: number;
    opacity: number;
    size: number;
    vec: Vec.Vector2;
  }[] = useMemo(
    () =>
      Array.from({ length: config.star.limit }, () => ({
        flickerRate: rand(0, 10) === 1 ? rand(1, 10) : 0,
        opacity: rand(0, 1),
        size: rand(0.5, 1.5),
        vec: [rand(0, 100), rand(0, 100 * (config.height / config.width))],
      })),
    [config.star.limit, config.height, config.width],
  );

  const images = useMemo(() => {
    if (typeof window === 'undefined') return null;

    // render automatically pulles new items.
    return [`./aurora-drop-${colorScheme}-a.png`].map((x) => {
      const img = new Image();
      img.src = x;
      return img;
    });
  }, [colorScheme]);

  // every even vector is a control point, will be transformed into quadratic
  // bezier curve
  const pathsBase = useMemo<PathDescriptor[]>(
    () => [
      {
        noise: createNoise2D(),
        points: [
          [10, -15],
          [0, 10],
          [40, 15],
          [80, 20],
          [50, 25],
          [30, 30],
          [100, 35],
        ],
      },
      {
        noise: createNoise2D(),
        points: [
          [25, -5],
          [5, 10],
          [50, 10],
          [85, 10],
          [75, 20],
          [60, 30],
          [100, 30],
        ],
      },
      {
        noise: createNoise2D(),
        points: [
          [-5, 15],
          [40, 15],
          [10, 25],
          [0, 30],
          [30, 35],
        ],
      },
    ],
    [],
  );

  const paths = useMemo<InterpolatedPathDescriptor[]>(
    () =>
      pathsBase.map((x) => {
        if (x.points.length % 2 === 0) {
          throw new Error('Segments must be odd!');
        }

        const segments = [];
        const lerps = [];
        for (let i = 0; i < Math.floor(x.points.length / 2); i++) {
          const segment = x.points.slice(i * 2, i * 2 + 3);
          segments.push(segment);
        }

        for (let i = 0; i < segments.length; i++) {
          for (let j = 0; j < config.aurora.lerpSteps; j++) {
            const b = Vec.quadraticBezierCurve(
              segments[i],
              j / config.aurora.lerpSteps,
            );
            lerps.push(b);
          }
        }

        return {
          ...x,
          segments,
          lerps,
        };
      }),
    [pathsBase, config.aurora],
  );

  const applyDecay = useCallback(() => {
    if (!canvasRef.current || !canvasCtx) return;

    if (config.frameDecay > 0) {
      canvasCtx.globalCompositeOperation = 'destination-in';
      canvasCtx.fillStyle = 'rgba(0, 0, 0, ' + (1 - config.frameDecay) + ')';
      canvasCtx.fillRect(0, 0, config.width, config.height);
      canvasCtx.globalCompositeOperation = 'source-over';
    }
  }, [config.frameDecay, config.width, config.height, canvasCtx]);

  const drawPath = useCallback(
    (path: InterpolatedPathDescriptor, offset: number) => {
      if (!canvasRef.current || !canvasCtx) return;

      const pointCount = path.lerps.length;
      for (let i = 0; i < pointCount; i++) {
        const vec = path.lerps[i];
        const pointNoise = path.noise(
          1,
          (offset + i) * config.aurora.noiseAmplitude,
        );
        const distance = 1 - i / pointCount; // 0-1

        const opacity =
          (1 + pointNoise) *
          (config.aurora.opacityNoiseFactor / 100) *
          distance;
        canvasCtx.globalAlpha = opacity;

        canvasCtx.drawImage(
          images[i % images.length],
          vec[0] * config.scale + config.aurora.wiggleAmplitude * pointNoise,
          vec[1] * config.scale + config.aurora.wiggleAmplitude * pointNoise,
          10 * config.scale,
          25 * config.scale * config.aurora.distanceHeightFactor * distance,
        );
      }
    },
    [canvasCtx, config, images],
  );

  const drawStars = useCallback(
    (frameCount: number) => {
      if (!canvasRef.current || !canvasCtx) return;

      for (let i = 0; i < starConfig.length; i++) {
        const star = starConfig[i];
        const flickerMod = star.flickerRate
          ? Math.floor(frameCount / star.flickerRate) % 100
          : 0;
        const opacity =
          flickerMod < 10
            ? star.opacity / config.star.flickerDepth
            : star.opacity;
        const color = `rgb(255, 255, 255, ${opacity})`;
        canvasCtx.beginPath();
        canvasCtx.arc(
          star.vec[0] * config.scale,
          star.vec[1] * config.scale,
          star.size,
          0,
          2 * Math.PI,
          false,
        );
        canvasCtx.fillStyle = color;
        canvasCtx.fill();
      }
    },
    [config.scale, config.star.flickerDepth, starConfig, canvasCtx],
  );

  const draw = useCallback(
    (clock: RenderStats) => {
      applyDecay();

      drawStars(clock.frameCount);
      for (let i = 0; i < paths.length; i++) {
        drawPath(paths[i], clock.frameCount);
      }
      canvasCtx.globalAlpha = 1;
    },
    [applyDecay, canvasCtx, drawStars, paths, drawPath],
  );

  useEffect(() => {
    if (!canvasRef.current || !canvasCtx) return;

    logger.log(`Rendering canvas...`);
    const windowResize = () => {
      canvasCtx.canvas.width = window.innerWidth;
      canvasCtx.canvas.height = window.innerHeight;
    };
    canvasCtx.scale(config.resolution, config.resolution);
    windowResize();
    window.addEventListener('resize', windowResize);

    const startTime = new Date().getTime();
    let lastDrawTime = 0;
    let lastFrameResourceId: number;
    let frameCount = 0;

    const renderNext = () => {
      const now = new Date().getTime();
      const delta = lastDrawTime ? now - lastDrawTime : 0;
      setFrameDeltaHistory((prev) => prev.slice(-100).concat(delta));
      draw({ delta, elapsed: now - startTime, frameCount });

      lastDrawTime = now;
      frameCount++;
      lastFrameResourceId = requestAnimationFrame(renderNext);
    };

    renderNext();

    return () => {
      removeEventListener('resize', windowResize);
      cancelAnimationFrame(lastFrameResourceId);
    };
  }, [canvasRef, canvasCtx, draw, config.resolution]);

  return (
    <div className={styles.container}>
      {appConfig.isDev && frameDeltaHistory.length > 0 && (
        <span className={styles.fpsCounter}>
          {Math.round(1000 / avg(frameDeltaHistory))}
        </span>
      )}
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
};

export default AnimatedBackground;
