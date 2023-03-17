import { GameState, SageGroup } from "./api";
import { Config } from "./model/config";
import { createGame } from "./model/game";
import { createRng, Rng } from "./model/rng";

interface UiState {
  sageIndex: number;
  effectIndex: number | null;
}

interface BenchmarkOptions {
  selectionFn: (
    state: GameState.T,
    rng: Rng,
    uiStateHistory: UiState[]
  ) => UiState;
  scoreFn: (state: GameState.T) => number;
  iteration: number;
  config: Config;
  seed: number;
}

export function benchmark({
  selectionFn,
  scoreFn,
  iteration,
  config,
  seed,
}: BenchmarkOptions) {
  let totalScore: number = 0;
  for (let i = 0; i < iteration; i++) {
    if (i % 1000 === 0) {
      console.log(`Iteration: ${i} Score: ${totalScore}`);
    }

    const rng = createRng(seed + i);
    let { game, api } = createGame({
      config,
      effectNames: ["A", "B", "C", "D", "E"],
      seed: seed + i,
    });
    let uiStateHistory: UiState[] = [];

    while (game.phase !== "done") {
      const uiState = selectionFn(game.state, rng, uiStateHistory);
      if (
        SageGroup.query.isCouncilRestart(
          game.state.sageGroup,
          uiState.sageIndex
        )
      ) {
        uiStateHistory = [];
      } else {
        uiStateHistory.push(uiState);
      }

      game = api.step(game, {
        sageIndex: uiState.sageIndex,
        effectIndex: uiState.effectIndex,
      });
    }

    totalScore += scoreFn(game.state);
  }

  return {
    totalScore,
    iteration,
  };
}
