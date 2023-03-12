import { createLogicService } from "../src/service/logic";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { createRngService, RngService } from "../src/service/rng";
import { createEffectService, EffectService } from "../src/service/effect";
import { GameState } from "../src/model/game";

const chance = createRngService();
const effectService = createEffectService(chance);

test("shuffle", () => {
  const chanceMock = {
    ...chance,
    shuffle: <T>(arr: T[]) => [4, 3, 1, 0] as T[],
  };
  const logicService = createLogicService(chanceMock, effectService);

  // given
  const state = {
    config: { maxEnchant: 10 },
    effects: [
      { value: 1, isSealed: false },
      { value: 10, isSealed: false },
      { value: 3, isSealed: true },
      { value: 4, isSealed: false },
      { value: 5, isSealed: false },
    ],
  } as unknown as GameState;

  // when
  const nextState = logicService.runLogic(
    state,
    {
      type: "shuffleAll",
      value: [0, 0],
      ratio: 0,
      remainTurn: 1,
    },
    []
  );

  // then
  assert.equal(nextState.effects, [
    { value: 5, isSealed: false },
    { value: 4, isSealed: false },
    { value: 3, isSealed: true },
    { value: 10, isSealed: false },
    { value: 1, isSealed: false },
  ]);
});

test.run();
