import { councilRecord, councilsPerType } from "../data/council";
import * as CouncilLogic from "./council-logic";
import * as GameState from "./game-state";
import type * as Game from "./game";
import { Rng } from "./rng";

export type CouncilType =
  | "common"
  | "lawful"
  | "lawfulSeal"
  | "seal"
  | "chaos"
  | "chaosSeal"
  | "exhausted";

export interface T {
  id: string;
  pickRatio: number;
  range: [number, number];
  descriptions: string[];
  type: CouncilType;
  slotType: 0 | 1 | 2 | 3;
  applyLimit: number;
  logics: CouncilLogic.T[];
}

function isCouncilAvailable(
  council: T,
  state: GameState.T,
  sageIndex: number,
  pickedCouncils: string[]
) {
  if (!GameState.query.isTurnInRange(state, council.range)) {
    return false;
  }

  if (pickedCouncils.includes(council.id)) {
    return false;
  }

  if (council.slotType === 3) {
    return true;
  }

  return council.slotType === sageIndex;
}

export function getAvailableCouncils(
  state: GameState.T,
  sageIndex: number,
  pickedCouncils: string[]
) {
  const councilType = GameState.query.getCouncilType(state, sageIndex);
  const availableCouncils = councilsPerType[councilType].filter((councilData) =>
    isCouncilAvailable(councilData, state, sageIndex, pickedCouncils)
  );
  if (availableCouncils.length === 0) {
    throw new Error("No council available");
  }

  return availableCouncils;
}

export function getOne(id: string) {
  const council = councilRecord[id];
  if (!council) {
    throw new Error("Invalid council id");
  }

  return council;
}

export function getLogicsFromId(id: string) {
  return getOne(id).logics;
}
