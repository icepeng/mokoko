import * as Board from "./board";
import { Config } from "./config";
import { Context } from "./context";
import * as Council from "./council";
import { runLogicGuard } from "./council-guard";
import * as GameState from "./game-state";
import * as Logic from "./council-logic";
import { createRng } from "./rng";
import * as SageGroup from "./sage-group";
import { getTargets } from "./target";

export interface T {
  state: GameState.T;
  config: Config;
  phase: "council" | "enchant" | "done";
}

export type Action =
  | {
      type: "applyCouncil";
      sageIndex: number;
      effectIndex: number | null;
    }
  | {
      type: "enchant";
      sageIndex: number;
      effectIndex: number | null;
    }
  | {
      type: "reroll";
    }
  | {
      type: "pickCouncils";
    };

export function reducer(game: T, action: Action, ctx: Context): T {
  const { rng } = ctx;
  const logicReducer = Logic.createReducer(ctx);
  const boardReducer = (state: GameState.T, action: Board.Action) =>
    GameState.boardReducer(state, action, ctx);

  function pickCouncil(sageIndex: number, pickedCouncils: string[]): string {
    const availableCouncils = Council.getAvailableCouncils(
      game.state,
      sageIndex,
      pickedCouncils
    );
    const weightTable = availableCouncils.map((council) => council.pickRatio);

    let selected: Council.T;
    let cnt = 0;
    while (true) {
      cnt++;
      if (cnt > 1000) {
        console.log(game.state, sageIndex, pickedCouncils);
        throw new Error("Failed to pick council");
      }

      selected = rng.weighted(availableCouncils, weightTable);
      if (selected.logics.every((logic) => runLogicGuard(game, logic))) {
        break;
      }
    }
    return selected.id;
  }

  function pickCouncils() {
    const council1 = pickCouncil(0, []);
    const council2 = pickCouncil(1, [council1]);
    const council3 = pickCouncil(2, [council1, council2]);
    return [council1, council2, council3];
  }

  switch (action.type) {
    case "pickCouncils":
      return {
        ...game,
        state: GameState.sageGroupReducer(game.state, {
          type: "setCouncils",
          councils: pickCouncils(),
        }),
      };

    case "applyCouncil":
      if (action.sageIndex == null) {
        throw new Error("Sage is not selected");
      }
      if (
        SageGroup.query.isEffectSelectionRequired(
          game.state.sageGroup,
          action.sageIndex
        ) &&
        action.effectIndex == null
      ) {
        throw new Error("Effect is not selected");
      }

      const council = SageGroup.query.getCouncil(
        game.state.sageGroup,
        action.sageIndex
      );
      const logics = council.logics;

      const counciledState = logics.reduce(
        (acc, logic) =>
          logicReducer(acc, {
            logic,
            targets: getTargets({
              state: acc,
              effectIndex: action.effectIndex,
              logic,
              rng: rng,
            }),
          }),
        game.state
      );

      if (counciledState.shouldRestart) {
        return reducer(
          {
            state: GameState.createInitialState(
              game.config.totalTurn,
              Board.query.getNames(game.state.board)
            ),
            config: game.config,
            phase: "council",
          },
          { type: "pickCouncils" },
          ctx
        );
      }

      return {
        ...game,
        state: counciledState,
        phase: "enchant",
      };

    case "enchant":
      if (action.sageIndex === null) {
        throw new Error("Sage is not selected");
      }
      if (game.phase !== "enchant") {
        throw new Error("Invalid phase: " + game.phase);
      }

      const { effectCount, increaseAmount, luckyRatios, pickRatios } =
        getEnchantInfos(game);

      let nextState = game.state;
      for (let i = 0; i < effectCount; i += 1) {
        if (pickRatios.every((ratio) => ratio === 0)) {
          break;
        }
        const selectedEffectIndex = rng.weighted([0, 1, 2, 3, 4], pickRatios);
        pickRatios[selectedEffectIndex] = 0;

        const luckyRatio = luckyRatios[selectedEffectIndex];
        const isLucky = rng.bool({ likelihood: luckyRatio * 100 });

        nextState = boardReducer(game.state, {
          type: "increaseValue",
          index: selectedEffectIndex,
          diff: increaseAmount + (isLucky ? 1 : 0),
        });
      }

      nextState = GameState.reducer(game.state, {
        type: "passTurn",
        selectedSageIndex: action.sageIndex,
      });
      const nextPhase = game.state.turnLeft === 1 ? "done" : "council";

      if (nextPhase === "done") {
        return {
          ...game,
          state: nextState,
          phase: nextPhase,
        };
      }
      return reducer(
        {
          ...game,
          state: nextState,
          phase: nextPhase,
        },
        { type: "pickCouncils" },
        ctx
      );

    case "reroll":
      if (game.state.rerollLeft <= 0) {
        throw new Error("No reroll left");
      }
      return reducer(
        {
          ...game,
          state: GameState.reducer(game.state, {
            type: "decreaseRerollLeft",
          }),
        },
        { type: "pickCouncils" },
        ctx
      );
    default:
      throw new Error("Unknown action");
  }
}

// queries
function isEffectMutable(game: T, effectIndex: number): boolean {
  return Board.query.isIndexMutable(
    game.state.board,
    effectIndex,
    game.config.maxEnchant
  );
}

function getPickRatios(game: T) {
  const state = game.state;
  const maxEnchant = game.config.maxEnchant;
  const mutableCount = [0, 1, 2, 3, 4].filter((index) =>
    Board.query.isIndexMutable(state.board, index, maxEnchant)
  ).length;

  const pickRatios = Array.from({ length: 5 }, (_, i) =>
    Board.query.isIndexMutable(state.board, i, maxEnchant)
      ? 1 / mutableCount
      : 0
  );

  if (mutableCount === 1) {
    return pickRatios;
  }

  const probMutations = state.mutations.filter(
    (mutation) => mutation.target === "prob"
  );

  for (const mutation of probMutations) {
    if (!Board.query.isIndexMutable(state.board, mutation.index, maxEnchant)) {
      continue;
    }

    const targetProb = pickRatios[mutation.index];
    const updatedProb = Math.max(Math.min(targetProb + mutation.value, 1), 0);
    const actualDiff = updatedProb - targetProb;
    if (actualDiff === 0) {
      continue;
    }

    for (let i = 0; i < 5; i += 1) {
      if (i === mutation.index) {
        pickRatios[i] = updatedProb;
      } else {
        pickRatios[i] = pickRatios[i] * (1 - actualDiff / (1 - targetProb));
      }
    }
  }

  return pickRatios;
}

function getLuckyRatios(game: T) {
  const luckyRatios = Array.from({ length: 5 }, () => 0.1);

  const luckyRatioMutations = game.state.mutations.filter(
    (mutation) => mutation.target === "luckyRatio"
  );
  for (const mutation of luckyRatioMutations) {
    luckyRatios[mutation.index] = Math.max(
      Math.min(luckyRatios[mutation.index] + mutation.value, 1),
      0
    );
  }

  return luckyRatios;
}

function getEnchantEffectCount(game: T) {
  return (
    game.state.mutations.find(
      (mutation) => mutation.target === "enchantEffectCount"
    )?.value ?? 1
  );
}

function getEnchantIncreaseAmount(game: T) {
  return (
    game.state.mutations.find(
      (mutation) => mutation.target === "enchantIncreaseAmount"
    )?.value ?? 1
  );
}

function getEnchantInfos(game: T) {
  return {
    effectCount: getEnchantEffectCount(game),
    increaseAmount: getEnchantIncreaseAmount(game),
    pickRatios: getPickRatios(game),
    luckyRatios: getLuckyRatios(game),
  };
}

export const query = {
  isEffectMutable,
  getPickRatios,
  getLuckyRatios,
  getEnchantEffectCount,
  getEnchantIncreaseAmount,
  getEnchantInfos,
};

// constructors
interface CreateGameProps {
  config: Config;
  effectNames: string[];
  seed?: number;
}

export function createGame({ config, effectNames, seed }: CreateGameProps) {
  const rng = createRng(seed);
  const ctx: Context = {
    rng,
    config,
  };
  const state = GameState.createInitialState(config.totalTurn, effectNames);
  const game: T = reducer(
    {
      state,
      config,
      phase: "council",
    },
    { type: "pickCouncils" },
    ctx
  );

  function applyCouncil(
    game: T,
    props: {
      sageIndex: number;
      effectIndex: number | null;
    }
  ) {
    return reducer(game, { ...props, type: "applyCouncil" }, ctx);
  }

  function enchant(
    game: T,
    props: {
      sageIndex: number;
      effectIndex: number | null;
    }
  ) {
    return reducer(game, { ...props, type: "enchant" }, ctx);
  }

  function reroll(game: T) {
    return reducer(game, { type: "reroll" }, ctx);
  }

  function step(
    game: T,
    props: {
      sageIndex: number;
      effectIndex: number | null;
    }
  ) {
    if (
      SageGroup.query.isCouncilRestart(game.state.sageGroup, props.sageIndex)
    ) {
      return applyCouncil(game, props);
    }
    return enchant(applyCouncil(game, props), props);
  }

  function reset() {
    return createGame({ config, effectNames, seed }).game;
  }

  return {
    game,
    api: {
      applyCouncil,
      enchant,
      reroll,
      step,
      reset,
    },
  };
}
