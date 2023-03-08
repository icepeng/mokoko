import { MAX_CHAOS, MAX_LAWFUL } from "../const";
import { GameState, SageState } from "../interface";
import councilData from "./data";
import { CouncilType } from "./interface";

const councilRecord = Object.fromEntries(
  councilData.map((item) => [item.id, item])
);

function isLawfulFull(sage: SageState) {
  return sage.type === "lawful" && sage.power === MAX_LAWFUL;
}

function isChaosFull(sage: SageState) {
  return sage.type === "chaos" && sage.power === MAX_CHAOS;
}

function isLockNeeded(state: GameState) {
  const lockedEffectCount = state.effects.filter(
    (effect) => effect.isLocked
  ).length;
  const toLock = 3 - lockedEffectCount;

  return state.turnLeft <= toLock;
}

function getCouncilType(state: GameState, sageIndex: number): CouncilType {
  const sage = state.sages[sageIndex];
  const isLock = isLockNeeded(state);

  if (isLawfulFull(sage)) {
    if (isLock) {
      return "lawfulLock";
    }

    return "lawful";
  }

  if (isChaosFull(sage)) {
    if (isLock) {
      return "chaosLock";
    }

    return "chaos";
  }

  if (isLock) {
    return "lock";
  }

  return "common";
}

export function pickCouncil(state: GameState, sageIndex: number): string {
  const councilType = getCouncilType(state, sageIndex);
  const currentTypeCouncils = councilData.filter(
    (data) => data.type === councilType
  );
  if (currentTypeCouncils.length === 0) {
    throw new Error("No council available");
  }

  const weightTable = currentTypeCouncils.map((council) => council.weight);
  const selected = chance.weighted(currentTypeCouncils, weightTable);
  return selected.id;
}
