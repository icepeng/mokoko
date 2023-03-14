import fs from "fs";
import path from "path";
import { api, benchmark, GameState, UiState } from "../../src";
import { basicSelectEffectPolicy } from "../policy";
import { argmax } from "../util";
import { createScoreCalculator } from "./calc";

const adviceCounting = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./advice_counting.json"), "utf8")
);
const curveRank12 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./curve_rank_12_indexed.json"), "utf8")
);
const curveProb12 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./curve_prob_12.json"), "utf8")
);
const curveRank13 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./curve_rank_13_indexed.json"), "utf8")
);
const curveProb13 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./curve_prob_13.json"), "utf8")
);
const curveRank14 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./curve_rank_14_indexed.json"), "utf8")
);
const curveProb14 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./curve_prob_14.json"), "utf8")
);
const curveRank15 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./curve_rank_15_indexed.json"), "utf8")
);
const curveProb15 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./curve_prob_15.json"), "utf8")
);

const scoreCalculator = createScoreCalculator({
  adviceCounting,
  curveRankRecord: {
    12: curveRank12,
    13: curveRank13,
    14: curveRank14,
    15: curveRank15,
  },
  curveProbRecord: {
    12: curveProb12,
    13: curveProb13,
    14: curveProb14,
    15: curveProb15,
  },
});

function selectionFn(state: GameState, uiHistory: UiState[]) {
  const scores = scoreCalculator.calculateScores(
    state,
    uiHistory.map((ui) => ui.selectedSageIndex!)
  );

  const selected = argmax(scores, (x) => x.score);
  const selectedEffectIndex = selected.effectIndex;

  if (selectedEffectIndex != null) {
    return {
      selectedSageIndex: selected.sageIndex,
      selectedEffectIndex: selected.effectIndex,
    };
  }

  if (
    api.game.isEffectSelectionRequired(state, {
      selectedSageIndex: selected.sageIndex,
      selectedEffectIndex: null,
    })
  ) {
    const councilId = state.sages[selected.sageIndex].councilId;
    const effectIndex = basicSelectEffectPolicy(
      state,
      councilId,
      [0, 1, 2, 3, 4]
    );
    return {
      selectedSageIndex: selected.sageIndex,
      selectedEffectIndex: effectIndex,
    };
  }

  return {
    selectedSageIndex: selected.sageIndex,
    selectedEffectIndex: null,
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
  iteration: 100000,
  seed: 0,
  selectionFn,
  scoreFn,
});

console.log(result);
