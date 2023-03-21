import { Council } from "../model/council";
import { GameConfiguration, GameState } from "../model/game";
import { UiState } from "../model/ui";
import { LogicService } from "./logic";
import { RngService } from "./rng";
import { SageService } from "./sage";
import { TargetService } from "./target";

export function createGameService(
  chance: RngService,
  sageService: SageService,
  logicService: LogicService,
  targetService: TargetService
) {
  function getInitialGameState(config: GameConfiguration): GameState {
    const state = GameState.createInitialState(config);
    return sageService.updateCouncils(state);
  }

  function applyCouncil(state: GameState, ui: UiState): GameState {
    if (state.phase !== "council") {
      throw new Error("Invalid phase in council: " + state.phase);
    }
    if (ui.selectedSageIndex === null) {
      throw new Error("Sage is not selected");
    }
    if (
      GameState.query.isEffectSelectionRequired(state, ui.selectedSageIndex) &&
      ui.selectedEffectIndex == null
    ) {
      throw new Error("Effect is not selected");
    }

    const sage = state.sages[ui.selectedSageIndex];
    const council = Council.query.getOne(sage.councilId);
    if (council.type === "exhausted") {
      throw new Error("Cannot select exhausted council");
    }

    const logics = council.logics;

    const counciledState = logics.reduce(
      (acc, logic) =>
        logicService.runLogic(
          acc,
          logic,
          targetService.getTargets(acc, ui, logic)
        ),
      state
    );

    const nextPhase =
      counciledState.phase === "restart" ? "restart" : "enchant";

    return {
      ...counciledState,
      phase: nextPhase,
      councilCount: {
        [council.id]: (counciledState.councilCount[council.id] || 0) + 1,
      },
    };
  }

  function enchant(state: GameState, ui: UiState): GameState {
    if (state.phase !== "enchant") {
      throw new Error("Invalid phase in enchant: " + state.phase);
    }
    if (ui.selectedSageIndex === null) {
      throw new Error("Sage is not selected");
    }

    const enchantEffectCount = GameState.query.getEnchantEffectCount(state);
    const enchantIncreaseAmount =
      GameState.query.getEnchantIncreaseAmount(state);
    const luckyRatios = GameState.query.getLuckyRatios(state);
    const pickRatios = GameState.query.getPickRatios(state);

    let nextState = state;
    for (let i = 0; i < enchantEffectCount; i += 1) {
      if (pickRatios.every((ratio) => ratio === 0)) {
        break;
      }
      const selectedEffectIndex = chance.weighted([0, 1, 2, 3, 4], pickRatios);
      pickRatios[selectedEffectIndex] = 0;

      const luckyRatio = luckyRatios[selectedEffectIndex];
      const isLucky = chance.bool({ likelihood: luckyRatio * 100 });

      nextState = GameState.increaseEffectValue(
        nextState,
        selectedEffectIndex,
        enchantIncreaseAmount + (isLucky ? 1 : 0)
      );
    }

    nextState = GameState.passTurn(nextState, ui.selectedSageIndex);

    if (nextState.phase === "done") {
      return nextState;
    }
    return sageService.updateCouncils(nextState);
  }

  function reroll(state: GameState): GameState {
    if (state.phase !== "council") {
      throw new Error("Invalid phase in reroll: " + state.phase);
    }
    if (state.rerollLeft <= 0) {
      throw new Error("No reroll left");
    }

    return sageService.rerollCouncils(GameState.decreaseRerollLeft(state));
  }

  function step(state: GameState, ui: UiState): GameState {
    const counciled = applyCouncil(state, ui);

    if (counciled.phase === "restart") {
      return getInitialGameState(counciled.config);
    }

    return sageService.updateCouncils(enchant(counciled, ui));
  }

  return {
    getInitialGameState,
    applyCouncil,
    enchant,
    reroll,
    step,
  };
}
