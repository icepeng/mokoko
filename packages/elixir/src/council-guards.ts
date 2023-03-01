import { MAX_LAWFUL, MAX_CHAOS } from "./const";
import { GameState } from "./interface";

export const isCommonCouncilAvailable = (
  state: GameState,
  sageIndex: number
) => {
  const sage = state.sages[sageIndex];

  if (sage.type === "lawful") {
    return sage.power < MAX_LAWFUL;
  }

  if (sage.type === "chaos") {
    return sage.power < MAX_CHAOS;
  }

  return true;
};

export const isLawfulFull = (state: GameState, sageIndex: number) => {
  const sage = state.sages[sageIndex];
  return sage.type === "lawful" && sage.power === MAX_LAWFUL;
};

export const isChaosFull = (state: GameState, sageIndex: number) => {
  const sage = state.sages[sageIndex];
  return sage.type === "chaos" && sage.power === MAX_CHAOS;
};
