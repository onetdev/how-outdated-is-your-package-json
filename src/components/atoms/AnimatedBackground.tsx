import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NoiseFunction2D, createNoise2D } from "simplex-noise";
import { styled } from "styled-components";

import * as Vec from "@/utils/vector2";

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
  const isDev = process.env.NODE_ENV === "development";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameDeltaHistory, setFrameDeltaHistory] = useState<number[]>([]);
  const canvasCtx = useMemo(
    () => canvasRef.current?.getContext("2d"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canvasRef.current]
  );

  const config = useMemo(
    () => ({
      scale: (canvasRef.current?.width || 100) / 100,
      lerpSteps: 150,
      globalDecay: 0.65, // [0,1]
      distanceHeightFactor: 0.6, // [0-1]
      speed: 0.001,
      opacityNoiseFactor: 0.05,
      wiggle: 20,
      starCount: 200,
      starFlickerDepth: 2,
    }),
    [canvasRef.current?.width]
  );

  const starConfig: {
    flickerRate: number;
    opacity: number;
    size: number;
    vec: Vec.Vector2;
  }[] = useMemo(
    () =>
      Array.from({ length: config.starCount }, () => ({
        flickerRate: rand(0, 10),
        opacity: rand(0, 1),
        size: rand(1, 2),
        vec: [rand(0, 100), rand(0, 100)],
      })),
    [config.starCount]
  );

  const images = useMemo(() => {
    if (typeof window === "undefined") return null;

    // render automatically pulles new items.
    return ["./aurora-drop-a.png"].map((x) => {
      const img = new Image();
      img.src = x;
      return img;
    });
  }, []);

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
    []
  );

  const paths = useMemo<InterpolatedPathDescriptor[]>(
    () =>
      pathsBase.map((x) => {
        if (x.points.length % 2 === 0) {
          throw new Error("Segments must be odd!");
        }

        const segments = [];
        const lerps = [];
        for (let i = 0; i < Math.floor(x.points.length / 2); i++) {
          const segment = x.points.slice(i * 2, i * 2 + 3);
          segments.push(segment);
        }

        for (let i = 0; i < segments.length; i++) {
          for (let j = 0; j < config.lerpSteps; j++) {
            const b = Vec.quadraticBezierCurve(
              segments[i],
              j / config.lerpSteps
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
    [pathsBase, config.lerpSteps]
  );

  const applyDecay = useCallback(() => {
    if (!canvasRef.current || !canvasCtx) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    if (config.globalDecay > 0) {
      canvasCtx.globalCompositeOperation = "destination-in";
      canvasCtx.fillStyle = "rgba(0, 0, 0, " + (1 - config.globalDecay) + ")";
      canvasCtx.fillRect(0, 0, width, height);
      canvasCtx.globalCompositeOperation = "source-over";
    }
  }, [config.globalDecay, canvasCtx]);

  const drawPath = useCallback(
    (path: InterpolatedPathDescriptor, offset: number) => {
      if (!canvasRef.current || !canvasCtx) return;

      const pointCount = path.lerps.length;
      for (let i = 0; i < pointCount; i++) {
        const vec = path.lerps[i];
        const pointNoise = path.noise(1, (offset + i) * config.speed);
        const distance = 1 - i / pointCount; // 0-1

        const opacity = (1 + pointNoise) * config.opacityNoiseFactor * distance;
        canvasCtx.globalAlpha = opacity;

        canvasCtx.drawImage(
          images[i % images.length],
          vec[0] * config.scale + config.wiggle * pointNoise,
          vec[1] * config.scale + config.wiggle * pointNoise,
          10 * config.scale,
          25 * config.scale * config.distanceHeightFactor * distance
        );
      }
    },
    [canvasCtx, config, images]
  );

  const drawStars = useCallback(
    (frameCount: number) => {
      if (!canvasRef.current || !canvasCtx) return;

      for (let i = 0; i < starConfig.length; i++) {
        const star = starConfig[i];
        const flickerMod = Math.floor(frameCount / star.flickerRate) % 100;
        const opacity =
          flickerMod < 10
            ? star.opacity / config.starFlickerDepth
            : star.opacity;
        const color = `rgb(255, 255, 255, ${opacity})`;
        canvasCtx.beginPath();
        canvasCtx.arc(
          star.vec[0] * config.scale,
          star.vec[1] * config.scale,
          star.size,
          0,
          2 * Math.PI,
          false
        );
        canvasCtx.fillStyle = color;
        canvasCtx.fill();
      }
    },
    [config.scale, config.starFlickerDepth, starConfig, canvasCtx]
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
    [applyDecay, canvasCtx, drawPath, config]
  );

  useEffect(() => {
    if (!canvasRef.current || !canvasCtx) return;

    console.log(`Rendering canvas...`);
    const windowResize = () => {
      canvasCtx.canvas.width = window.innerWidth;
      canvasCtx.canvas.height = window.innerHeight;
    };
    windowResize();
    window.addEventListener("resize", windowResize);

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
      removeEventListener("resize", windowResize);
      cancelAnimationFrame(lastFrameResourceId);
    };
  }, [canvasRef, canvasCtx, draw]);

  return (
    <Container>
      {isDev && frameDeltaHistory.length > 0 && (
        <FpsCounter>{Math.round(1000 / avg(frameDeltaHistory))}</FpsCounter>
      )}
      <Canvas ref={canvasRef} />
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  left: 0;
  max-width: 100vw;
  overflow: hidden;
  position: absolute;
  top: 0;
  z-index: 1;
`;
const FpsCounter = styled.span`
  background: red;
  color: white;
  left: 0;
  position: absolute;
  top: 0;
  opacity: 0.2;
`;
const Canvas = styled.canvas`
  height: 100%;
  width: 100%;
`;

export default AnimatedBackground;
