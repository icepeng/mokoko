import { benchmark, Board, GameState, SageGroup } from "../src";
import { Rng } from "../src/model/rng";
import { basicSelectEffectPolicy } from "./policy";

function selectionFn(state: GameState.T, rng: Rng) {
  const sageIndex = rng.pickone(
    SageGroup.query.getSelectableSageIndices(state.sageGroup)
  );
  const councilId = state.sageGroup[sageIndex].councilId;
  const effectIndex = basicSelectEffectPolicy(
    state,
    councilId,
    [0, 1, 2, 3, 4]
  );

  return {
    sageIndex,
    effectIndex,
  };
}

function scoreFn(state: GameState.T) {
  const score = [0, 1, 2, 3, 4]
    .map((index) => Board.query.getLevel(state.board, index))
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
