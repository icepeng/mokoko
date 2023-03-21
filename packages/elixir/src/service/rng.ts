import { Chance } from "chance";

export function createRngService() {
  let chance = new Chance();

  function setSeed(seed: number) {
    chance = new Chance(seed);
  }

  function bool(opts?: { likelihood: number }) {
    if (opts?.likelihood === 10000) {
      return true;
    }
    if (opts?.likelihood === 0) {
      return false;
    }
    return chance.bool(opts);
  }

  function pickone<T>(items: T[]) {
    return chance.pickone(items);
  }

  function pickset<T>(items: T[], size: number) {
    return chance.pickset(items, size);
  }

  function weighted<T>(items: T[], weights: number[]) {
    return chance.weighted(items, weights);
  }

  function integer({ min, max }: { min: number; max: number }) {
    return chance.integer({ min, max });
  }

  function shuffle<T>(arr: T[]): T[] {
    return chance.shuffle(arr);
  }

  function redistributeOne(props: {
    values: number[];
    indexToRedistribute: number;
    fixedIndices: number[];
    limit: number;
  }): number[] {
    const { values: _values, indexToRedistribute, fixedIndices, limit } = props;
    const values = [..._values];

    const amount = values[indexToRedistribute];
    for (let i = 0; i < amount; i++) {
      const availableIndexes = [0, 1, 2, 3, 4].filter(
        (index) =>
          !fixedIndices.includes(index) &&
          values[index] < limit &&
          index !== indexToRedistribute
      );
      if (availableIndexes.length === 0) break;

      const index = chance.pickone(availableIndexes);
      values[index]++;
      values[indexToRedistribute]--;
    }

    return values;
  }

  function redistributeAll(props: {
    values: number[];
    fixedIndices: number[];
    limit: number;
  }): number[] {
    const { values: _values, fixedIndices, limit } = props;
    const values = Array.from(_values, (value, i) =>
      fixedIndices.includes(i) ? value : 0
    );
    const amount = _values.reduce(
      (acc, val, i) => (fixedIndices.includes(i) ? acc : acc + val),
      0
    );

    for (let i = 0; i < amount; i++) {
      const availableIndexes = [0, 1, 2, 3, 4].filter(
        (index) => !fixedIndices.includes(index) && values[index] < limit
      );
      if (availableIndexes.length === 0) break;

      const index = chance.pickone(availableIndexes);
      values[index]++;
    }

    return values;
  }

  return {
    setSeed,
    bool,
    pickone,
    pickset,
    weighted,
    integer,
    shuffle,
    redistributeOne,
    redistributeAll,
  };
}

export type RngService = ReturnType<typeof createRngService>;
