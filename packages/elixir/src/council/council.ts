import { MAX_CHAOS, MAX_LAWFUL } from "../const";
import { GameState, SageState } from "../interface";
import chance from "../rng";
import councilData from "./data";
import { CouncilData, CouncilType } from "./interface";
import { runLogicGuard } from "./logic-guard";
import { checkLockNeeded } from "./util";

const councilRecord = Object.fromEntries(
  councilData.map((item) => [item.id, item])
);

function isLawfulFull(sage: SageState) {
  return sage.type === "lawful" && sage.power === MAX_LAWFUL;
}

function isChaosFull(sage: SageState) {
  return sage.type === "chaos" && sage.power === MAX_CHAOS;
}

function getCouncilType(state: GameState, sageIndex: number): CouncilType {
  const sage = state.sages[sageIndex];
  const isLockNeeded = checkLockNeeded(state);

  if (isLawfulFull(sage)) {
    if (isLockNeeded) {
      return "lawfulLock";
    }

    return "lawful";
  }

  if (isChaosFull(sage)) {
    if (isLockNeeded) {
      return "chaosLock";
    }

    return "chaos";
  }

  if (isLockNeeded) {
    return "lock";
  }

  return "common";
}

function isTurnInRange(state: GameState, council: CouncilData) {
  if (council.range[0] === 0) {
    return true;
  }

  const turn = state.config.totalTurn - state.turnLeft;
  return turn >= council.range[0] && turn < council.range[1];
}

export function pickCouncil(state: GameState, sageIndex: number): string {
  const councilType = getCouncilType(state, sageIndex);
  const availableCouncils = councilData
    .filter((data) => data.type === councilType)
    .filter((data) => isTurnInRange(state, data))
    .filter((data) =>
      data.logics.every((logic) => runLogicGuard(state, logic))
    );
  if (availableCouncils.length === 0) {
    throw new Error("No council available");
  }

  const weightTable = availableCouncils.map((council) => council.pickupRatio);
  const selected = chance.weighted(availableCouncils, weightTable);
  return selected.id;
}

export function getCouncilLogics(id: string) {
  const council = councilRecord[id];
  if (!council) {
    throw new Error("Invalid council id");
  }

  return council.logics;
}

export function getCouncilDescription(state: GameState, sageIndex: number) {
  const id = state.sages[sageIndex].councilId;
  const council = councilRecord[id];
  if (!council) {
    throw new Error("Invalid council id");
  }

  const effectNames = state.effects.map((eff) => eff.name);
  return council.descriptions[sageIndex]
    .replaceAll("{0}", effectNames[0])
    .replaceAll("{1}", effectNames[1])
    .replaceAll("{2}", effectNames[2])
    .replaceAll("{3}", effectNames[3])
    .replaceAll("{4}", effectNames[4]);
}
