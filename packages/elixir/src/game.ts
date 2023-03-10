import { getCouncilDescription, getCouncilLogics, runLogic } from "./council";
import { getTargets } from "./council/target";
import { GameConfiguration, GameState, UiState } from "./interface";
import { queryMutationResults } from "./mutation";
import chance from "./rng";
import * as sageService from "./sage";

export function getInitialGameState(config: GameConfiguration): GameState {
  const state: GameState = {
    config,
    phase: "council",
    turnLeft: config.totalTurn,
    rerollLeft: 2,
    sages: [
      {
        type: "none",
        power: 0,
        isExhausted: false,
        councilId: "",
      },
      {
        type: "none",
        power: 0,
        isExhausted: false,
        councilId: "",
      },
      {
        type: "none",
        power: 0,
        isExhausted: false,
        councilId: "",
      },
    ],
    effects: [
      {
        name: "자원의 축복",
        value: 0,
        isLocked: false,
      },
      {
        name: "무기 공격력",
        value: 0,
        isLocked: false,
      },
      {
        name: "민첩",
        value: 0,
        isLocked: false,
      },
      {
        name: "보스 피해",
        value: 0,
        isLocked: false,
      },
      {
        name: "무력화",
        value: 0,
        isLocked: false,
      },
    ],
    mutations: [],
  };

  return sageService.updateCouncils(state);
}

export function getInitialUiState(): UiState {
  return {
    selectedSageIndex: null,
    selectedEffectIndex: null,
  };
}

export function getSageDescription(state: GameState, index: number): string {
  return getCouncilDescription(state, index);
}

export function requireEffectSelection(state: GameState, ui: UiState): boolean {
  if (ui.selectedSageIndex === null) {
    return false;
  }

  const sage = state.sages[ui.selectedSageIndex];
  const councilLogics = getCouncilLogics(sage.councilId);

  return councilLogics.some((logic) => logic.targetType === "userSelect");
}

export function applyCouncil(state: GameState, ui: UiState): GameState {
  if (ui.selectedSageIndex === null) {
    throw new Error("Sage is not selected");
  }
  if (requireEffectSelection(state, ui) && ui.selectedEffectIndex == null) {
    throw new Error("Effect is not selected");
  }

  const sage = state.sages[ui.selectedSageIndex];
  const logics = getCouncilLogics(sage.councilId);

  const counciledState = logics.reduce(
    (acc, logic) => runLogic(acc, logic, getTargets(acc, ui, logic)),
    state
  );

  return {
    ...counciledState,
    phase: "enchant",
  };
}

export function enchant(state: GameState, ui: UiState): GameState {
  if (ui.selectedSageIndex === null) {
    throw new Error("Sage is not selected");
  }

  const { pickRatios, luckyRatios, enchantEffectCount, enchantIncreaseAmount } =
    queryMutationResults(state);

  let effects = [...state.effects];
  for (let i = 0; i < enchantEffectCount; i += 1) {
    const selectedEffectIndex = chance.weighted([0, 1, 2, 3, 4], pickRatios);
    pickRatios[selectedEffectIndex] = 0;

    const luckyRatio = luckyRatios[selectedEffectIndex];
    const isLucky = chance.bool({ likelihood: luckyRatio * 100 });

    effects = effects.map((effect, index) => {
      if (index === selectedEffectIndex) {
        return {
          ...effect,
          value: effect.value + enchantIncreaseAmount + (isLucky ? 1 : 0),
        };
      }

      return effect;
    });
  }

  const mutations = state.mutations
    .map((mutation) => ({
      ...mutation,
      remainTurn: mutation.remainTurn - 1,
    }))
    .filter((mutation) => mutation.remainTurn > 0);

  const turnLeft = state.turnLeft - 1;
  const nextPhase = turnLeft === 0 ? "done" : "council";

  return sageService.updateCouncils({
    ...state,
    effects,
    mutations,
    turnLeft,
    phase: nextPhase,
    sages: sageService.updatePowers(state.sages, ui.selectedSageIndex),
  });
}

export function reroll(state: GameState): GameState {
  if (state.rerollLeft <= 0) {
    throw new Error("No reroll left");
  }

  return {
    ...sageService.updateCouncils(state),
    rerollLeft: state.rerollLeft - 1,
  };
}
