import { api, benchmark, GameState } from "../src";
import { Action } from "../src/benchmark";
import { basicSelectEffectPolicy } from "./policy";

function selectionFn(state: GameState): Action {
  const sageIndex = api.rng.pickone(GameState.query.getSelectableSages(state));
  const councilId = state.sages[sageIndex].councilId;
  const effectIndex = basicSelectEffectPolicy(
    state,
    councilId,
    [0, 1, 2, 3, 4]
  );

  return {
    type: "enchant",
    sageIndex,
    effectIndex,
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
