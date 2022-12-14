import { ANY_ENGRAVE } from "./const";
import { EngravePair, EngraveSum } from "./interface";
import { product } from "./util";

export function splitNumber(
  num: number,
  higherMax: number,
  higherMin: number,
  lowerMin: number
): number[][] {
  const result: number[][] = [];
  function rec(arr: number[], sum: number) {
    if (sum === num) {
      result.push(arr);
      return;
    }
    if (sum > num) {
      if (arr[arr.length - 1] <= higherMin) {
        result.push(arr);
      }
      return;
    }
    for (let i = arr[arr.length - 1] || lowerMin; i <= higherMax; i += 1) {
      rec([...arr, i], sum + i);
    }
  }
  rec([], 0);
  return result;
}

export function combine(
  splits: number[][],
  groupNames: string[],
  length: number,
  higherMin: number,
  lowerMin: number
) {
  const arr = splits.flatMap((split, index) =>
    split.map((num) => ({ num, group: groupNames[index] }))
  );
  const result: EngravePair[][] = [];
  const visited = new Set();

  function rec(
    list: EngravePair[],
    used: Record<string, boolean>,
    si: number,
    sj: number
  ) {
    const hash = JSON.stringify(list);
    if (visited.has(hash)) {
      return;
    }
    visited.add(hash);

    if (list.length === length) {
      result.push(list);
      return;
    }

    for (let i = si; i < arr.length; i += 1) {
      if (used[i]) {
        continue;
      }

      const start =
        arr[si - 1]?.group === arr[i].group && arr[si - 1]?.num === arr[i].num
          ? sj
          : i + 1;
      for (let j = start; j < arr.length; j += 1) {
        if (arr[i].num > lowerMin && arr[j].num > lowerMin) {
          continue;
        }
        if (used[j]) {
          continue;
        }
        if (arr[i].group !== arr[j].group) {
          if (arr[i].num >= higherMin || arr[j].num >= higherMin) {
            rec(
              [
                ...list,
                [
                  { name: arr[i].group, amount: arr[i].num },
                  { name: arr[j].group, amount: arr[j].num },
                ],
              ],
              { ...used, [i]: true, [j]: true },
              i + 1,
              j + 1
            );
          }
        }
      }
    }
  }
  rec([], {}, 0, 0);
  return result;
}

export interface GetCombinationsProps {
  target: EngraveSum;

  /**
   * Length of combination
   * @max 5
   * @min 1
   */
  length: number;

  itemGrade: "유물" | "고대";
}

export function getCombinations({
  target,
  length,
  itemGrade,
}: GetCombinationsProps) {
  const higherMax = {
    유물: 5,
    고대: 6,
  }[itemGrade];
  const higherMin = {
    유물: 3,
    고대: 4,
  }[itemGrade];
  const lowerMin = 3;

  return [
    ...product(
      ...Object.values(target).map((x) =>
        splitNumber(x, higherMax, higherMin, lowerMin)
      )
    ),
  ]
    .filter((splits) => splits.flat().length <= length * 2)
    .filter(
      (splits) => splits.flat().filter((num) => num > lowerMin).length <= length
    )
    .map((splits) => {
      const padding = length * 2 - splits.flat().length;
      return [...splits, Array.from({ length: padding }, () => lowerMin)];
    })
    .flatMap((splits) =>
      combine(
        splits,
        [...Object.keys(target), ANY_ENGRAVE],
        length,
        higherMin,
        lowerMin
      )
    );
}
