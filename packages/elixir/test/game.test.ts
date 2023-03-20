import { test } from "uvu";
import * as assert from "uvu/assert";
import { api } from "../src";
import { GameState } from "../src/model/game";

const initialState = GameState.createInitialState({
  maxEnchant: 10,
  totalTurn: 14,
});

test("getEnchantEffectCount", () => {
  // given
  const gameState: GameState = {
    ...initialState,
    phase: "enchant",
    mutations: [
      { target: "enchantEffectCount", index: -1, value: 2, remainTurn: 1 },
    ],
  };

  // when
  const count = GameState.query.getEnchantEffectCount(gameState);

  // then
  assert.equal(count, 2);
});

test("enchant - 2회", () => {
  // given
  const gameState: GameState = {
    ...initialState,
    phase: "enchant",
    mutations: [
      { target: "enchantEffectCount", index: -1, value: 2, remainTurn: 1 },
    ],
  };

  // when
  const resultState = api.game.enchant(gameState, {
    selectedSageIndex: 0,
    selectedEffectIndex: 0,
  });

  // then
  const totalValues = resultState.effects
    .map((effect) => effect.value)
    .reduce((a, b) => a + b, 0);
  assert.is([2, 3].includes(totalValues), true);
});

test.run();
