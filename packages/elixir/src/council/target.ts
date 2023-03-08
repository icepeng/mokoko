import { isEffectMutable } from "../effect";
import { GameState, UiState } from "../interface";
import chance from "../rng";
import { CouncilLogicData, CouncilTargetType } from "./interface";

function none(state: GameState, ui: UiState, logic: CouncilLogicData) {
  return [];
}

function random(state: GameState, ui: UiState, logic: CouncilLogicData) {
  const available = [0, 1, 2, 3, 4].filter((index) =>
    isEffectMutable(state.effects[index], state.config.maxEnchant)
  );

  return chance.pickset(available, logic.targetCount);
}

function proposed(state: GameState, ui: UiState, logic: CouncilLogicData) {
  return [logic.targetCondition];
}

function minValue(state: GameState, ui: UiState, logic: CouncilLogicData) {
  const available = [0, 1, 2, 3, 4].filter((index) =>
    isEffectMutable(state.effects[index], state.config.maxEnchant)
  );

  const minValue = Math.min(
    ...available.map((index) => state.effects[index].value)
  );

  const candidates = available.filter(
    (index) => state.effects[index].value === minValue
  );

  return chance.pickset(candidates, logic.targetCount);
}

function maxValue(state: GameState, ui: UiState, logic: CouncilLogicData) {
  const available = [0, 1, 2, 3, 4].filter((index) =>
    isEffectMutable(state.effects[index], state.config.maxEnchant)
  );

  const maxValue = Math.max(
    ...available.map((index) => state.effects[index].value)
  );

  const candidates = available.filter(
    (index) => state.effects[index].value === maxValue
  );

  return chance.pickset(candidates, logic.targetCount);
}

function userSelect(state: GameState, ui: UiState, logic: CouncilLogicData) {
  return [ui.selectedEffectIndex];
}

function lteValue(state: GameState, ui: UiState, logic: CouncilLogicData) {
  const available = [0, 1, 2, 3, 4].filter((index) =>
    isEffectMutable(state.effects[index], state.config.maxEnchant)
  );

  const candidates = available.filter(
    (index) => state.effects[index].value <= logic.targetCondition
  );

  return chance.pickset(candidates, logic.targetCount);
}

function oneThreeFive(state: GameState) {
  return [0, 2, 4];
}

function twoFour(state: GameState) {
  return [1, 3];
}

const targetFns: Record<
  CouncilTargetType,
  (state: GameState, ui: UiState, logic: CouncilLogicData) => number[]
> = {
  none,
  random,
  proposed,
  minValue,
  maxValue,
  userSelect,
  lteValue,
  oneThreeFive,
  twoFour,
};

function getTargets(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): number[] {
  return targetFns[logic.targetType](state, ui, logic);
}

export default getTargets;
