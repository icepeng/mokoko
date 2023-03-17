import { Rng } from "./rng";
import type * as GameState from "./game-state";
import type * as CouncilLogic from "./council-logic";
import * as Board from "./board";
import { CouncilTargetType } from "./council-logic";

interface GetTargetProps {
  rng: Rng;
  state: GameState.T;
  effectIndex: number | null;
  logic: CouncilLogic.T;
}

export function getTargets({
  rng,
  state,
  effectIndex,
  logic,
}: GetTargetProps): number[] {
  function none() {
    return [];
  }

  function random() {
    const available = Board.query.getUnsealedIndices(state.board);

    return rng.pickset(available, logic.targetCount);
  }

  function proposed() {
    return [logic.targetCondition - 1];
  }

  function minValue() {
    const [_, candidates] = Board.query.getUnsealedMinValueIndices(state.board);

    return rng.pickset(candidates, logic.targetCount);
  }

  function maxValue() {
    const [_, candidates] = Board.query.getUnsealedMaxValueIndices(state.board);

    return rng.pickset(candidates, logic.targetCount);
  }

  function userSelect() {
    if (effectIndex == null) {
      throw new Error("Effect is not selected");
    }

    return [effectIndex];
  }

  function lteValue() {
    const available = Board.query.getUnsealedIndices(state.board);

    return available.filter(
      (index) =>
        Board.query.getValue(state.board, index) <= logic.targetCondition
    );
  }

  function oneThreeFive() {
    return [0, 2, 4].filter(
      (index) => !Board.query.isIndexSealed(state.board, index)
    );
  }

  function twoFour() {
    return [1, 3].filter(
      (index) => !Board.query.isIndexSealed(state.board, index)
    );
  }

  const targetFns: Record<CouncilTargetType, () => number[]> = {
    none,
    random,
    proposed,
    minValue,
    maxValue,
    userSelect,
    lteValue,
    oneThreeFive,
    twoFour,
  };

  return targetFns[logic.targetType]();
}
