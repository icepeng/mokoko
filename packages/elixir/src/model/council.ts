export type CouncilLogicType =
  | "mutateProb" // 1
  | "mutateLuckyRatio" // 2
  | "increaseTargetWithRatio" // 3
  | "increaseTargetRanged" // 4
  | "decreaseTurnLeft" // 5
  | "shuffleAll" // 6
  | "setEnchantTargetAndAmount" // 7
  | "unsealAndSealOther" // 8
  | "changeEffect" // 9
  | "sealTarget" // 10
  | "increaseReroll" // 11
  | "decreasePrice" // 12
  | "restart" // 13
  | "setEnchantIncreaseAmount" // 14
  | "setEnchantEffectCount" // 15
  | "setValueRanged" // 16
  | "redistributeAll" // 17
  | "redistributeSelectedToOthers" // 18
  | "shiftAll" // 19
  | "swapValues" // 20
  | "swapMinMax" // 23
  | "exhaust" // 24
  | "increaseMaxAndDecreaseTarget" // 25
  | "increaseMinAndDecreaseTarget" // 26
  | "redistributeMinToOthers" // 27
  | "redistributeMaxToOthers" // 28
  | "decreaseMaxAndSwapMinMax" // 29
  | "decreaseFirstTargetAndSwap"; // 30

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

export interface CouncilLogic {
  type: CouncilLogicType;
  ratio: number;
  value: [number, number];
  remainTurn: number;
}

export type CouncilType =
  | "common"
  | "lawful"
  | "lawfulSeal"
  | "seal"
  | "chaos"
  | "chaosSeal"
  | "exhausted";

export interface Council {
  id: string;
  pickupRatio: number;
  range: [number, number];
  descriptions: string[];
  type: CouncilType;
  slotType: 0 | 1 | 2 | 3;
  applyLimit: number;
  applyImmediately: boolean;
  logics: CouncilLogicData[];
}
