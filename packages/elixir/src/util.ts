export function clamp(value: number, max: number): number {
  return Math.min(Math.max(value, 0), max);
}

export function and<T extends unknown[]>(
  ...fns: ((...args: T) => boolean)[]
): (...args: T) => boolean {
  return (...args: T) => fns.every((fn) => fn(...args));
}
