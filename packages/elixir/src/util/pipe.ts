export function pipe<A, B>(value: A, op1: (input: A) => B): B;
export function pipe<A, B, C>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C
): C;

export function pipe<A, B, C, D>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D
): D;

export function pipe<A, B, C, D, E>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E
): E;

export function pipe<A, B, C, D, E, F>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F
): F;

export function pipe<A, B, C, D, E, F, G>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G
): G;

export function pipe<A, B, C, D, E, F, G, H>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H
): H;

export function pipe<A, B, C, D, E, F, G, H, I>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H,
  op8: (input: H) => I
): I;
export function pipe(
  value: unknown,
  ...fns: Array<(...x: unknown[]) => unknown>
) {
  return fns.reduce((val, fn) => fn(val), value);
}
