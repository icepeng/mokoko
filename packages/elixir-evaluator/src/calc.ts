import { api, data, GameState, Sage } from "@mokoko/elixir";
import { randomSelectEffectPolicy } from "./policy";
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
  curveCounting: number[][][][][];
}

/**
 * 0 - 현자삭제된 상태
 * 1,2,3,4,5,6 - 각각 순서대로 혼돈 6,5,4,3,2,1 (역순 주의)
 * 7 - 0, 시작시에만
 * 8,9,10 - 질서 1,2,3
 */
function sageToIndex(sage: Sage) {
  if (sage.isExhausted) {
    return 0;
  }
  if (sage.type === "chaos") {
    return 7 - sage.power;
  }
  if (sage.type === "lawful") {
    return 7 + sage.power;
  }
  return 7;
}

function step(state: GameState, sageIndex: number) {
  const ui = {
    selectedSageIndex: sageIndex,
    selectedEffectIndex: randomSelectEffectPolicy(state),
  };
  const counciled = api.game.applyCouncil(state, ui);
  return GameState.passTurn({ ...counciled, phase: "enchant" }, sageIndex);
}

export function createScoreCalculator({
  adviceCounting,
  curveCounting,
}: ScoreCalculatorData) {
  /**
   * (11,11,11,14,4)
   * 스택/스택/스택/남은연성횟수/남은 봉인가능횟수
   */
  function getCurveScores(gameState: GameState) {
    return [0, 1, 2].map((index) => {
      if (gameState.sages[index].isExhausted) return -1;

      const stateToAnalyze = step(gameState, index);
      const [first, second, third] = stateToAnalyze.sages.map((sage) =>
        sageToIndex(sage)
      );
      const turnLeft = stateToAnalyze.turnLeft;
      const toSeal = GameState.query.getEffectCountToSeal(stateToAnalyze);

      const curveScore =
        curveCounting[first][second][third][Math.max(turnLeft - 1, 0)][toSeal];
      return curveScore;
    });
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
    targetIndices: [number, number]
  ) {
    const curveScores = getCurveScores(gameState);
    const adviceScores = getAdviceScores(gameState, targetIndices);

    return [0, 1, 2].flatMap((sageIndex) => ({
      sageIndex,
      effectIndex: adviceScores[sageIndex].effectIndex,
      score:
        adviceScores[sageIndex].score < 0 || curveScores[sageIndex] < 0
          ? -1
          : curveScores[sageIndex] *
            Math.pow(adviceScores[sageIndex].score, 2.0),
    }));
  }

  return {
    getAdviceScores,
    getBaselineAdviceScore,
    calculateScores,
  };
}
