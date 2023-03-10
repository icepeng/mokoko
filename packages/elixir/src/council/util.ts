import { GameState } from "../interface";

export function partition(
  n: number,
  k: number,
  lockedValues: (number | null)[]
): number[][] {
  function rec(left: number, depth: number): number[][] {
    const lockedValue = lockedValues[depth];
    if (depth === k - 1) {
      if (lockedValue !== null && lockedValue !== left) {
        return [];
      }

      return [[left]];
    } else {
      const results = [];
      if (lockedValue !== null) {
        const subResults = rec(left - lockedValue, depth + 1);
        for (const subResult of subResults) {
          results.push([lockedValue, ...subResult]);
        }
        return results;
      }

      for (let i = 0; i <= left; i++) {
        const subResults = rec(left - i, depth + 1);
        for (const subResult of subResults) {
          results.push([i, ...subResult]);
        }
      }
      return results;
    }
  }

  return rec(n, 0);
}

export function cycle(n: number, mod: number, direction: 0 | 1) {
  if (direction === 0) {
    return (n + mod - 1) % mod;
  } else {
    return (n + 1) % mod;
  }
}
