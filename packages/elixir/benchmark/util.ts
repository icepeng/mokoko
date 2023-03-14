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
