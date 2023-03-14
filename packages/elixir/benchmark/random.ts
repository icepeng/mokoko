import { api, benchmark, GameState } from "../src";
import { basicSelectEffectPolicy } from "./policy";

function selectionFn(state: GameState) {
  const selectedSageIndex = api.rng.pickone(api.game.getSelectableSages(state));
  const councilId = state.sages[selectedSageIndex].councilId;
  const selectedEffectIndex = basicSelectEffectPolicy(
    state,
    councilId,
    [0, 1, 2, 3, 4]
  );

  return {
    selectedSageIndex,
    selectedEffectIndex,
  };
}

function scoreFn(state: GameState) {
  const score = [0, 1, 2, 3, 4]
    .map((index) => api.game.getEffectLevel(state, index))
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
  iteration: 1000000,
  seed: 0,
  selectionFn,
  scoreFn,
});

console.log(result);
