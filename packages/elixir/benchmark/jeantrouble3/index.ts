import { benchmark, GameState } from "../../src";
import { Action } from "../../src/benchmark";
import { createUiState } from "../ui-state";
import { argmax, getMaxIndexN } from "../util";
import { scoreCalculator } from "./calc-init";
import { shouldReroll } from "./reroll";

function selectionFn(state: GameState): Action {
  const values = state.effects.map((effect) =>
    effect.isSealed ? 0 : effect.value
  );
  const targetIndices = getMaxIndexN(values, 2) as [number, number];
  if (shouldReroll(state, targetIndices)) {
    return {
      type: "reroll",
    };
  }

  const scores = scoreCalculator.calculateScores(state, targetIndices);

  const selected = argmax(scores, (x) => x.score);
  const selectedEffectIndex = selected.effectIndex;

  if (selectedEffectIndex != null) {
    return {
      type: "enchant",
      sageIndex: selected.sageIndex,
      effectIndex: selected.effectIndex,
    };
  }

  const uiState = createUiState(state, selected.sageIndex);
  return {
    type: "enchant",
    sageIndex: uiState.selectedSageIndex,
    effectIndex: uiState.selectedEffectIndex,
  };
}

function scoreFn(state: GameState) {
  const score = [0, 1, 2, 3, 4]
    .map((index) => GameState.query.getEffectLevel(state, index))
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a + b, 0);

  if (score >= 8) {
    return 1;
  }
  return 0;
}

const result = benchmark({
  config: {
    maxEnchant: 10,
    totalTurn: 14,
  },
  iteration: 100000,
  seed: 0,
  selectionFn,
  scoreFn,
});

console.log(result);
