import { data, GameState } from "../../src";

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
  adviceCounting: number[][][][][][];
  curveRankRecord: Record<number, number[][]>;
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

  function getAdviceScores(gameState: GameState) {
    const adviceScores = gameState.sages.map((sage) => {
      const councilIndex = councilIndexTable[sage.councilId];
      if (councilIndex === -1) {
        return {
          effectIndex: null,
          score: 0,
        };
      }

      const values = gameState.effects.map((effect) => effect.value);
      const sealed = gameState.effects.map((effect) => effect.isSealed);
      const a = adviceCounting[sealed[0] ? 0 : values[0]];
      const b = a[sealed[1] ? 0 : values[1]];
      const c = b[sealed[2] ? 0 : values[2]];
      const d = c[sealed[3] ? 0 : values[3]];
      const e = d[sealed[4] ? 0 : values[4]];

      if (requireSelect.includes(sage.councilId)) {
        const scores = [-5, -4, -3, -2, -1].map((i, index) =>
          sealed[index] ? -9999999 : e[councilIndex + i]
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
        score: e[councilIndex],
      };
    });

    return adviceScores;
  }

  function calculateScores(gameState: GameState, currentCurve: number[]) {
    const curveScores = getCurveScores(gameState, currentCurve);
    const adviceScores = getAdviceScores(gameState);

    return [0, 1, 2].flatMap((sageIndex) => ({
      sageIndex,
      effectIndex: adviceScores[sageIndex].effectIndex,
      score:
        (0.0001 + curveScores[sageIndex] / 100) *
        (0.0001 + adviceScores[sageIndex].score),
    }));
  }

  return {
    calculateScores,
  };
}
