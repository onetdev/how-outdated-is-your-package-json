import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createNoise2D } from "simplex-noise";
import styled from "styled-components";

import * as Vec from "@/utils/vector2";

const AnimatedBackground: FunctionComponent = () => {
  const noise = useMemo(() => createNoise2D(), []);
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
      lerpSteps: 80,
      globalDecay: 0.65, // [0,1]
      distanceHeightFactor: 0.3, // [0-1]
      speed: 0.001,
      opacityNoiseFactor: 0.02,
      wiggle: 5,
    }),
    [canvasRef.current?.width]
  );

  const image = useMemo(() => {
    if (typeof window === "undefined") return null;

    const img = new Image();
    img.src = "./aurora-drop.png";
    return img;
  }, []);

  const paths = useMemo<{ color: string; points: Vec.Vector2[][] }[]>(
    () => [
      {
        color: "rgb(255, 0, 255)",
        points: [
          [
            [10, -5],
            [0, 10],
            [40, 15],
          ],
          [
            [40, 15],
            [80, 20],
            [50, 25],
          ],
          [
            [50, 25],
            [30, 30],
            [100, 35],
          ],
        ],
      },
      {
        color: "rgb(255, 255, 0)",
        points: [
          [
            [25, -5],
            [5, 10],
            [50, 10],
          ],
          [
            [50, 10],
            [85, 10],
            [75, 20],
          ],
          [
            [75, 20],
            [60, 30],
            [100, 30],
          ],
        ],
      },
      {
        color: "rgb(0, 255, 255)",
        points: [
          [
            [-5, 15],
            [40, 15],
            [10, 25],
          ],
          [
            [10, 25],
            [0, 28],
            [30, 35],
          ],
        ],
      },
    ],
    []
  );

  const avg = (items: number[]) =>
    items.reduce((a, b) => a + b, 0) / items.length;
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  const draw = useCallback(
    (clock: { delta: number; elapsed: number; frameCount: number }) => {
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      if (config.globalDecay > 0) {
        canvasCtx.globalCompositeOperation = "destination-in";
        canvasCtx.fillStyle = "rgba(0, 0, 0, " + (1 - config.globalDecay) + ")";
        canvasCtx.fillRect(0, 0, width, height);
        canvasCtx.globalCompositeOperation = "source-over";
      }

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        let pathDrawIndex = 0;
        const pointCount = path.points.length * config.lerpSteps;
        for (let j = 0; j < path.points.length; j++) {
          for (let k = 0; k < config.lerpSteps; k++) {
            const distance = 1 - pathDrawIndex / pointCount;
            const distanceHeightFactor =
              1 - config.distanceHeightFactor * distance;
            const b = Vec.quadraticBezierCurve(
              path.points[j],
              k / config.lerpSteps
            );
            const pointNoise = noise(
              i * 10,
              (clock.frameCount + pathDrawIndex) * config.speed
            );
            const opacity =
              (1 + pointNoise) * config.opacityNoiseFactor * distance;
            canvasCtx.globalAlpha = opacity;
            canvasCtx.drawImage(
              image,
              b[0] * config.scale + config.wiggle * pointNoise,
              b[1] * config.scale + config.wiggle * pointNoise,
              10 * config.scale,
              25 * config.scale * distanceHeightFactor
            );
            pathDrawIndex++;
          }
        }
      }
      canvasCtx.globalAlpha = 1;
    },
    [canvasCtx, config, noise]
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
      {frameDeltaHistory.length > 0 && (
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
