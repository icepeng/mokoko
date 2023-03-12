import game, { GameConfiguration, GameState } from "../model/game";
import { UiState } from "../model/ui";
import { CouncilService } from "./council";
import { LogicService } from "./logic";
import { MutationService } from "./mutation";
import { RngService } from "./rng";
import { SageService } from "./sage";
import { TargetService } from "./target";

export function createGameService(
  chance: RngService,
  sageService: SageService,
  councilService: CouncilService,
  logicService: LogicService,
  targetService: TargetService,
  mutationService: MutationService
) {
  function getInitialGameState(config: GameConfiguration): GameState {
    const state = game.createInitialState(config);
    return sageService.updateCouncils(state);
  }

  function isEffectSelectionRequired(state: GameState, ui: UiState): boolean {
    if (ui.selectedSageIndex === null) {
      return false;
    }

    const sage = state.sages[ui.selectedSageIndex];
    const logics = councilService.getLogics(sage.councilId);

    return logics.some((logic) => logic.targetType === "userSelect");
  }

  function applyCouncil(state: GameState, ui: UiState): GameState {
    if (ui.selectedSageIndex === null) {
      throw new Error("Sage is not selected");
    }
    if (
      isEffectSelectionRequired(state, ui) &&
      ui.selectedEffectIndex == null
    ) {
      throw new Error("Effect is not selected");
    }

    const sage = state.sages[ui.selectedSageIndex];
    const logics = councilService.getLogics(sage.councilId);

    const counciledState = logics.reduce(
      (acc, logic) =>
        logicService.runLogic(
          acc,
          logic,
          targetService.getTargets(acc, ui, logic)
        ),
      state
    );

    if (counciledState.phase === "restart") {
      return getInitialGameState(counciledState.config);
    }

    return {
      ...counciledState,
      phase: "enchant",
    };
  }

  function enchant(state: GameState, ui: UiState): GameState {
    if (ui.selectedSageIndex === null) {
      throw new Error("Sage is not selected");
    }

    const enchantEffectCount = mutationService.queryEnchantEffectCount(state);
    const enchantIncreaseAmount =
      mutationService.queryEnchantIncreaseAmount(state);
    const luckyRatios = mutationService.queryLuckyRatios(state);
    const pickRatios = mutationService.queryPickRatios(state);

    let nextState = state;
    for (let i = 0; i < enchantEffectCount; i += 1) {
      if (pickRatios.every((ratio) => ratio === 0)) {
        break;
      }
      const selectedEffectIndex = chance.weighted([0, 1, 2, 3, 4], pickRatios);
      pickRatios[selectedEffectIndex] = 0;

      const luckyRatio = luckyRatios[selectedEffectIndex];
      const isLucky = chance.bool({ likelihood: luckyRatio * 100 });

      state = game.increaseEffectValue(
        nextState,
        selectedEffectIndex,
        enchantIncreaseAmount + (isLucky ? 1 : 0)
      );
    }

    nextState = game.passTurn(state, ui.selectedSageIndex);

    if (nextState.phase === "done") {
      return nextState;
    }
    return sageService.updateCouncils(nextState);
  }

  function reroll(state: GameState): GameState {
    if (state.rerollLeft <= 0) {
      throw new Error("No reroll left");
    }

    return game.decreaseRerollLeft(state);
  }
  return {
    getInitialGameState,
    isEffectSelectionRequired,
    applyCouncil,
    enchant,
    reroll,
  };
}