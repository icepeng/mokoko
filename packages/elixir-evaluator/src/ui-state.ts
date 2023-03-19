import { GameState } from "@mokoko/elixir";
import { basicSelectEffectPolicy } from "./policy";

export function createUiState(state: GameState, sageIndex: number) {
  if (![0, 1, 2].includes(sageIndex)) console.log(sageIndex);
  if (GameState.query.isEffectSelectionRequired(state, sageIndex)) {
    const councilId = state.sages[sageIndex].councilId;
    const selectedEffectIndex = basicSelectEffectPolicy(
      state,
      councilId,
      [0, 1, 2, 3, 4]
    );
    return {
      selectedSageIndex: sageIndex,
      selectedEffectIndex,
    };
  }

  return {
    selectedSageIndex: sageIndex,
    selectedEffectIndex: null,
  };
}
