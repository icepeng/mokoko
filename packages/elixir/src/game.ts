import { getCouncilById } from "./council";
import { queryEffectsProb } from "./effect";
import { GameConfiguration, GameState } from "./interface";
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
        isRemoved: false,
        councilId: "",
      },
      {
        type: "none",
        power: 0,
        isRemoved: false,
        councilId: "",
      },
      {
        type: "none",
        power: 0,
        isRemoved: false,
        councilId: "",
      },
    ],
    effects: [
      {
        name: "자원의 축복",
        value: 0,
        luckyRatio: 0.1,
        isLocked: false,
      },
      {
        name: "무기 공격력",
        value: 0,
        luckyRatio: 0.1,
        isLocked: false,
      },
      {
        name: "민첩",
        value: 0,
        luckyRatio: 0.1,
        isLocked: false,
      },
      {
        name: "보스 피해",
        value: 0,
        luckyRatio: 0.1,
        isLocked: false,
      },
      {
        name: "무력화",
        value: 0,
        luckyRatio: 0.1,
        isLocked: false,
      },
    ],
    mutations: [],
    selectedSageIndex: -1,
  };

  return sageService.updateCouncils(state);
}

export function getSageDescription(state: GameState, index: number): string {
  return sageService.getCouncilDescription(state, index);
}

export function applyCouncil(
  state: GameState,
  sageIndex: number,
  effectIndex?: number
): GameState {
  const sage = state.sages[sageIndex];
  const council = getCouncilById(sage.councilId);

  const counciledState = council.onCouncil
    ? council.onCouncil(state, sageIndex, effectIndex)
    : state;

  return {
    ...counciledState,
    selectedSageIndex: sageIndex,
    phase: "enchant",
  };
}

export function patchEnchantCouncil(state: GameState): GameState {
  const { sages } = state;
  const selectedSage = sages[state.selectedSageIndex];
  const council = getCouncilById(selectedSage.councilId);

  if (council.onEnchant) {
    return council.onEnchant(state, state.selectedSageIndex);
  }

  return state;
}

export function enchant(state: GameState): GameState {
  const patchedState = patchEnchantCouncil(state);
  const weightProb = queryEffectsProb(patchedState);

  let effects = [...state.effects];
  for (let i = 0; i < patchedState.enchantEffectCount; i += 1) {
    const selectedEffectIndex = chance.weighted([0, 1, 2, 3, 4], weightProb);
    const { luckyRatio } = patchedState.effects[selectedEffectIndex];
    weightProb[selectedEffectIndex] = 0;

    const isLucky = chance.bool({ likelihood: luckyRatio * 100 });

    effects = effects.map((effect, index) => {
      if (index === selectedEffectIndex) {
        return {
          ...effect,
          value: effect.value + state.enchantIncreaseAmount + (isLucky ? 1 : 0),
        };
      }

      return effect;
    });
  }

  const turnLeft = state.turnLeft - 1;
  const nextPhase = turnLeft === 0 ? "done" : "council";

  return sageService.updateCouncils({
    ...state,
    effects,
    turnLeft,
    phase: nextPhase,
    sages: sageService.updatePowers(state.sages, state.selectedSageIndex),
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

// TODO: Sage Service를 public으로 제공하고, 여기는 제거할것
export function updateSagePower(
  state: GameState,
  sageIndex: number
): GameState {
  return {
    ...state,
    turnLeft: state.turnLeft - 1,
    sages: sageService.updatePowers(state.sages, sageIndex),
  };
}
