export type CouncilLogicType =
  | "mutateProb"
  | "mutateLuckyRatio"
  | "increaseTargetWithRatio"
  | "increaseTargetRanged"
  | "decreaseTurnLeft"
  | "shuffleAll"
  | "setEnchantTargetAndAmount"
  | "unlockTargetAndLockOther"
  | "changeEffect"
  | "lockTarget"
  | "increaseReroll"
  | "decreasePrice"
  | "restart"
  | "setEnchantIncreaseAmount"
  | "setEnchantEffectCount"
  | "setValueRanged"
  | "redistributeAll"
  | "redistributeSelectedToOthers"
  | "shiftAll"
  | "swapTargets"
  | "swapMinMax"
  | "exhaust"
  | "increaseMaxAndDecreaseTarget"
  | "increaseMinAndDecreaseTarget"
  | "redistributeMinToOthers"
  | "redistributeMaxToOthers"
  | "decreaseMaxAndSwapMinMax"
  | "decreaseFirstTargetAndSwap";

export type CouncilTargetType =
  | "none"
  | "random"
  | "proposed"
  | "maxValue"
  | "minValue"
  | "userSelect"
  | "lteValue"
  | "oneThreeFive"
  | "twoFour";

export interface CouncilLogicData {
  type: CouncilLogicType;
  targetType: CouncilTargetType;
  targetCondition: number;
  targetCount: number;
  ratio: number;
  value: [number, number];
  remainTurn: number;
}

export type CouncilType =
  | "common"
  | "lawful"
  | "lawfulLock"
  | "lock"
  | "chaos"
  | "chaosLock"
  | "exhausted";

export interface CouncilData {
  id: string;
  pickupRatio: number;
  range: [number, number];
  descriptions: string[];
  type: CouncilType;
  slotType: 0 | 1 | 2 | 3;
  applyLimit: number;
  applyImmediately: boolean;
  logic: CouncilLogicData[];
}
