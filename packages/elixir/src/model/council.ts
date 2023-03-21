import { councilRecord } from "../data/council";
import { GameState } from "./game";

export type CouncilLogicType =
  | "mutateProb"
  | "mutateLuckyRatio"
  | "increaseTargetWithRatio"
  | "increaseTargetRanged"
  | "decreaseTurnLeft"
  | "shuffleAll"
  | "setEnchantTargetAndAmount"
  | "unsealAndSealOther"
  | "changeEffect"
  | "sealTarget"
  | "increaseReroll"
  | "decreasePrice"
  | "restart"
  | "setEnchantIncreaseAmount"
  | "setEnchantEffectCount"
  | "setValueRanged"
  | "redistributeAll"
  | "redistributeSelectedToOthers"
  | "shiftAll"
  | "swapValues"
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
  pickRatio: number;
  range: [number, number];
  descriptions: string[];
  type: CouncilType;
  slotType: 0 | 1 | 2 | 3;
  applyLimit: number;
  logics: CouncilLogicData[];
}

// queries
function getOne(id: string) {
  const council = councilRecord[id];
  if (!council) {
    throw new Error("Invalid council id");
  }

  return council;
}

function getLogics(id: string) {
  return getOne(id).logics;
}

function isIncludingLogicType(id: string, type: CouncilLogicType) {
  return getLogics(id).some((logic) => logic.type === type);
}

const query = {
  getOne,
  getLogics,
  isIncludingLogicType,
};

export const Council = {
  query,
};
