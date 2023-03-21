import { test } from "uvu";
import * as assert from "uvu/assert";
import { GameState } from "../src/model/game";
import { createLogicGuardService } from "../src/service/logic-guard";

const logicGuardService = createLogicGuardService();
const initialState = GameState.createInitialState({
  maxEnchant: 10,
  totalTurn: 14,
});

test("lteValue 타겟 없을시 guard", () => {
  // given
  const state: GameState = {
    ...initialState,
    effects: [
      { value: 7, isSealed: false },
      { value: 7, isSealed: false },
      { value: 5, isSealed: true },
      { value: 5, isSealed: true },
      { value: 5, isSealed: true },
    ],
  } as unknown as GameState;

  // when
  const isAcceptable = logicGuardService.runLogicGuard(state, {
    type: "increaseTargetWithRatio",
    targetType: "lteValue",
    targetCondition: 4,
    targetCount: 5,
    ratio: 10000,
    value: [1, 0],
    remainTurn: 1,
  });

  // then
  assert.is(isAcceptable, false);
});

test("lteValue 타겟 없을시 guard", () => {
  // given
  const state: GameState = {
    ...initialState,
    effects: [
      { value: 7, isSealed: false },
      { value: 7, isSealed: false },
      { value: 5, isSealed: true },
      { value: 5, isSealed: true },
      { value: 5, isSealed: true },
    ],
  } as unknown as GameState;

  // when
  const isAcceptable = logicGuardService.runLogicGuard(state, {
    type: "increaseTargetWithRatio",
    targetType: "lteValue",
    targetCondition: 4,
    targetCount: 5,
    ratio: 10000,
    value: [1, 0],
    remainTurn: 1,
  });

  // then
  assert.is(isAcceptable, false);
});
