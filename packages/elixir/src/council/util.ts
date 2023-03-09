export function partition(n: number, k: number): number[][] {
  if (k === 1) {
    return [[n]];
  } else {
    const results = [];
    for (let i = 0; i <= n; i++) {
      const subResults = partition(n - i, k - 1);
      for (const subResult of subResults) {
        results.push([i, ...subResult]);
      }
    }
    return results;
  }
}

export function cycle(n: number, mod: number, direction: 0 | 1) {
  if (direction === 0) {
    return (n + mod - 1) % mod;
  } else {
    return (n + 1) % mod;
  }
}
