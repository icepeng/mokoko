import { Board, Council, GameState, rng } from "../src";
import { argmax, argmin } from "./util";

export function randomSelectEffectPolicy(state: GameState.T) {
  return rng.pickone(Board.query.getSelectableEffectIndices(state.board));
}

export function basicSelectEffectPolicy(
  state: GameState.T,
  councilId: string,
  objectiveIndices: number[]
) {
  const council = Council.getOne(councilId);

  const logic = council.logics[0];
  if (logic.targetType !== "userSelect") {
    return -1;
  }

  const objectives = objectiveIndices.filter(
    (index) => !state.board[index].isSealed
  );
  const nonObjectives = objectiveIndices
    .filter((index) => !objectives.includes(index))
    .filter((index) => !state.board[index].isSealed);

  if (logic.type === "mutateProb") {
    if (logic.value[0] > 0) {
      return objectives.length > 0
        ? argmax(objectives, (index) => state.board[index].value)
        : argmax(nonObjectives, (index) => state.board[index].value);
    } else {
      return nonObjectives.length > 0
        ? argmin(nonObjectives, (index) => state.board[index].value)
        : argmin(objectives, (index) => state.board[index].value);
    }
  }

  if (
    logic.type === "mutateLuckyRatio" ||
    logic.type === "setEnchantTargetAndAmount" ||
    logic.type === "increaseTargetWithRatio" ||
    logic.type === "increaseTargetRanged"
  ) {
    return objectives.length > 0
      ? argmax(objectives, (index) => state.board[index].value)
      : argmax(nonObjectives, (index) => state.board[index].value);
  }

  if (logic.type === "redistributeSelectedToOthers") {
    return nonObjectives.length > 0
      ? argmax(nonObjectives, (index) => state.board[index].value)
      : argmin(objectives, (index) => state.board[index].value);
  }

  if (logic.type === "sealTarget" || logic.type === "changeEffect") {
    return nonObjectives.length > 0
      ? argmin(nonObjectives, (index) => state.board[index].value)
      : argmin(objectives, (index) => state.board[index].value);
  }

  throw new Error("Unknown logic type: " + logic.type);
}
