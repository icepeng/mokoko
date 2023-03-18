import { data, GameState } from "../../src";
import { councilConverter } from "./index-converter";

function createCouncilIndexTable() {
  let i = 0;
  const table: Record<string, number> = {};
  data.councils.forEach((council) => {
    if (council.type !== "exhausted" && council.logics[0].type !== "restart") {
      table[council.id] = i;
      i += 1;
    } else {
      table[council.id] = -1;
    }
  });

  return table;
}

const councilIndexTable = createCouncilIndexTable();

const requireSelect = [
  "a5gxIgIR",
  "gWvAL7v4",
  "6VmV1uPy",
  "0f1OGjTw",
  "7wgizvUn",
  "1Z2+BfwB",
  "q+a6jS9L",
  "l+rAEPKP",
  "s+iwb0Rw",
  "CO+S24gs",
  "hVCN9GMr",
  "wCFQOzcX",
  "PkuGa1XV",
  "8Syfgx/g",
  "79o+kxjm",
  "X0RAe7B2",
  "KEO802/y",
  "zxpmYMXP",
  "vsB18riz",
];

interface ScoreCalculatorData {
  adviceCounting: number[][][][];
  curveRankRecord: Record<number, Record<string, number>>;
  curveProbRecord: Record<number, number[]>;
}

export function createScoreCalculator({
  adviceCounting,
  curveRankRecord,
  curveProbRecord,
}: ScoreCalculatorData) {
  function getCurveScores(gameState: GameState, currentCurve: number[]) {
    const gameLength = gameState.turnLeft + gameState.turnPassed;
    const curveRank = curveRankRecord[Math.max(Math.min(gameLength, 15), 12)];
    const curveProb = curveProbRecord[Math.max(Math.min(gameLength, 15), 12)];

    const bestCurveIndexes = [0, 1, 2].map(
      (nextIndex) => curveRank[[...currentCurve, nextIndex].join("")]
    );
    const curveScores = bestCurveIndexes.map((index) => curveProb[index] ?? 0);
    return curveScores;
  }

  function getAdviceScores(
    gameState: GameState,
    [first, second]: [number, number]
  ) {
    const values = gameState.effects.map((effect) =>
      effect.isSealed ? 0 : effect.value
    );
    const sealed = gameState.effects.map((effect) => effect.isSealed);

    const adviceScores = gameState.sages.map((sage) => {
      const councilIndex = councilIndexTable[sage.councilId];
      if (councilIndex === -1) {
        return {
          effectIndex: null,
          score: -1,
        };
      }

      const convertedIndex =
        councilIndexTable[councilConverter([first, second], sage.councilId)];

      const a = adviceCounting[values[first]];
      const b = a[values[second]];
      const c = b[gameState.turnLeft - 1];

      if (requireSelect.includes(sage.councilId)) {
        const scores = [-5, -4, -3, -2, -1].map((i, index) =>
          sealed[index] ? -1 : c[convertedIndex + i]
        );
        const score = Math.max(...scores);
        const effectIndex = scores.indexOf(score);
        return {
          effectIndex,
          score,
        };
      }

      return {
        effectIndex: null,
        score: c[convertedIndex],
      };
    });

    return adviceScores;
  }

  function getBaselineAdviceScore(
    gameState: GameState,
    [first, second]: [number, number]
  ) {
    const values = gameState.effects.map((effect) =>
      effect.isSealed ? 0 : effect.value
    );
    const a = adviceCounting[values[first]];
    const b = a[values[second]];
    const c = b[gameState.turnLeft - 1];
    const councilIndex = councilIndexTable["XR286C4T"]; // 비용감소
    return c[councilIndex] / 2;
  }

  function calculateScores(
    gameState: GameState,
    currentCurve: number[],
    targetIndices: [number, number]
  ) {
    const curveScores = getCurveScores(gameState, currentCurve);
    const adviceScores = getAdviceScores(gameState, targetIndices);

    // const curveStdev = stdev(curveScores);
    // const MEAN_CURVE_STDEV = 0.003632;

    // if (curveStdev > MEAN_CURVE_STDEV * 2) {
    //   return [0, 1, 2].flatMap((sageIndex) => ({
    //     sageIndex,
    //     effectIndex: adviceScores[sageIndex].effectIndex,
    //     score:
    //       (curveScores[sageIndex] + 0.01) *
    //       Math.pow(adviceScores[sageIndex].score, 1.5),
    //   }));
    // }

    return [0, 1, 2].flatMap((sageIndex) => ({
      sageIndex,
      effectIndex: adviceScores[sageIndex].effectIndex,
      score:
        adviceScores[sageIndex].score < 0
          ? -1
          : (curveScores[sageIndex] + 0.001) *
            Math.pow(adviceScores[sageIndex].score, 2),
    }));
  }

  return {
    getAdviceScores,
    getBaselineAdviceScore,
    calculateScores,
  };
}
