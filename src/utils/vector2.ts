export type Vector2 = [number, number];
type Scalar = number;

export const add = (v1: Vector2, v2: Vector2): Vector2 => [
  v1[0] + v2[0],
  v1[1] + v2[1],
];

export const subtract = (v1: Vector2, v2: Vector2): Vector2 => [
  v1[0] - v2[0],
  v1[1] - v2[1],
];

export const scalarMultiply = (vector: Vector2, scalar: Scalar): Vector2 => [
  vector[0] * scalar,
  vector[1] * scalar,
];

export const dotProduct = (v1: Vector2, v2: Vector2) =>
  v1[0] * v2[0] + v1[1] * v2[1];

export const magnitude = (vector: Vector2) =>
  Math.sqrt(vector[0] ** 2 + vector[1] ** 2);

export const normalize = (vector: Vector2) => {
  const mag = magnitude(vector);
  if (mag === 0) return [0, 0]; // Avoid division by zero
  return [vector[0] / mag, vector[1] / mag];
};

export const lerp = (v1: Vector2, v2: Vector2, t: Scalar) =>
  add(scalarMultiply(v1, 1 - t), scalarMultiply(v2, t));

export const quadraticBezierCurve = ([p0, p1, p2]: Vector2[], t: number) => {
  const q0 = lerp(p0, p1, t);
  const q1 = lerp(p1, p2, t);
  const b = lerp(q0, q1, t);
  return b;
};
