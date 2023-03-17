export interface T {
  target:
    | "prob"
    | "luckyRatio"
    | "enchantIncreaseAmount"
    | "enchantEffectCount";
  index: number;
  value: number;
  remainTurn: number;
}

export type Action = {
  type: "passTurn";
};

export function reducer(mutation: T, action: Action): T {
  switch (action.type) {
    case "passTurn":
      if (mutation.remainTurn <= 0) {
        throw new Error("T is already expired");
      }
      return {
        ...mutation,
        remainTurn: mutation.remainTurn - 1,
      };
    default:
      return mutation;
  }
}

// constructors
export function createProbMutation(
  index: number,
  value: number,
  remainTurn: number
): T {
  return {
    target: "prob",
    index,
    value,
    remainTurn,
  };
}

export function createLuckyRatioMutation(
  index: number,
  value: number,
  remainTurn: number
): T {
  return {
    target: "luckyRatio",
    index,
    value,
    remainTurn,
  };
}

export function createEnchantIncreaseAmountMutation(value: number): T {
  return {
    target: "enchantIncreaseAmount",
    index: -1,
    value,
    remainTurn: 1,
  };
}

export function createEnchantEffectCountMutation(value: number): T {
  return {
    target: "enchantEffectCount",
    index: -1,
    value,
    remainTurn: 1,
  };
}
