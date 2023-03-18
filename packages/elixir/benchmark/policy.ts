import { api, Council, GameState } from "../src";
import { argmax, argmin } from "./util";

export function randomSelectEffectPolicy(state: GameState) {
  return api.rng.pickone(GameState.query.getSelectableEffects(state));
}

export function basicSelectEffectPolicy(
  state: GameState,
  councilId: string,
  objectiveIndices: number[]
) {
  const council = Council.query.getOne(councilId);

  const logic = council.logics[0];
  if (logic.targetType !== "userSelect") {
    return -1;
  }

  const objectives = objectiveIndices.filter(
    (index) => !state.effects[index].isSealed
  );
  const nonObjectives = objectiveIndices
    .filter((index) => !objectives.includes(index))
    .filter((index) => !state.effects[index].isSealed);

  if (logic.type === "mutateProb") {
    if (logic.value[0] > 0) {
      return objectives.length > 0
        ? argmax(objectives, (index) => state.effects[index].value)
        : argmax(nonObjectives, (index) => state.effects[index].value);
    } else {
      return nonObjectives.length > 0
        ? argmin(nonObjectives, (index) => state.effects[index].value)
        : argmin(objectives, (index) => state.effects[index].value);
    }
  }

  if (
    logic.type === "mutateLuckyRatio" ||
    logic.type === "setEnchantTargetAndAmount" ||
    logic.type === "increaseTargetWithRatio" ||
    logic.type === "increaseTargetRanged"
  ) {
    return objectives.length > 0
      ? argmax(objectives, (index) => state.effects[index].value)
      : argmax(nonObjectives, (index) => state.effects[index].value);
  }

  if (logic.type === "redistributeSelectedToOthers") {
    return nonObjectives.length > 0
      ? argmax(nonObjectives, (index) => state.effects[index].value)
      : argmin(objectives, (index) => state.effects[index].value);
  }

  if (logic.type === "sealTarget" || logic.type === "changeEffect") {
    return nonObjectives.length > 0
      ? argmin(nonObjectives, (index) => state.effects[index].value)
      : argmin(objectives, (index) => state.effects[index].value);
  }

  throw new Error("Unknown logic type: " + logic.type);
}
