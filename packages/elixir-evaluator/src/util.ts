export function argmax<T>(arr: T[], fn: (x: T) => number): T {
  let maxIndex = 0;
  let maxValue = fn(arr[0]);
  for (let i = 1; i < arr.length; i++) {
    const value = fn(arr[i]);
    if (value > maxValue) {
      maxIndex = i;
      maxValue = value;
    }
  }
  return arr[maxIndex];
}

export function argmin<T>(arr: T[], fn: (x: T) => number): T {
  let minIndex = 0;
  let minValue = fn(arr[0]);
  for (let i = 1; i < arr.length; i++) {
    const value = fn(arr[i]);
    if (value < minValue) {
      minIndex = i;
      minValue = value;
    }
  }
  return arr[minIndex];
}

export function getMaxIndexN(arr: number[], n: number): number[] {
  return [...arr]
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value)
    .map((x) => x.index)
    .slice(0, n);
}

export function softmax(arr: number[]): number[] {
  const exps = arr.map((x) => Math.exp(x));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((x) => x / sum);
}

export function stdev(arr: number[]): number {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance =
    arr.map((x) => (x - mean) ** 2).reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(variance);
}
