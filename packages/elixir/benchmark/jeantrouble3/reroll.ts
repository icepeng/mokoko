import { Council, GameState, Sage } from "../../src";
import { MAX_LAWFUL } from "../../src/data/const";
import { scoreCalculator } from "./calc-init";

export function shouldReroll(
  state: GameState,
  targetIndices: [number, number]
): boolean {
  if (state.rerollLeft === 0) {
    return false;
  }

  const baseline = scoreCalculator.getBaselineAdviceScore(state, targetIndices);
  const adviceScores = scoreCalculator.getAdviceScores(state, targetIndices);
  const hasOverBaseline = adviceScores.find((x) => x.score > baseline);

  if (!hasOverBaseline) {
    return true;
  }

  if (GameState.query.checkSealNeeded(state)) {
    const lawfulFullSage = state.sages.find((x) => Sage.query.isLawfulFull(x))!;
    if (lawfulFullSage && lawfulFullSage.councilId !== "mYuyjIL/") {
      return true;
    }

    const lawfulSage = state.sages.find((x) => x.type === "lawful")!;
    const power = lawfulSage.power;

    if (state.turnLeft > MAX_LAWFUL - power) {
      const council = Council.query.getOne(lawfulSage.councilId);
      if (
        council.type === "seal" &&
        council.logics[0].type === "sealTarget" &&
        targetIndices.includes(council.logics[0].targetCondition - 1)
      ) {
        return true;
      }
    }
  }

  return false;
}
