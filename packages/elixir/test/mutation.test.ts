import { test } from "uvu";
import * as assert from "uvu/assert";
import { GameState } from "../src/interface";
import { queryPickRatios } from "../src/mutation";
import { getInitialGameState } from "../src";

const initialState = getInitialGameState({ maxEnchant: 10, totalTurn: 14 });

function round(num: number, precision: number) {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

function postProcessPickRatios(pickRatios: number[]) {
  return pickRatios.map((rate) => round(rate, 8));
}

test("queryPickRatios - 최초 상태", () => {
  // given
  const gameState: GameState = { ...initialState };

  // when
  const pickRatios = queryPickRatios(gameState);

  // then
  assert.equal(postProcessPickRatios(pickRatios), [0.2, 0.2, 0.2, 0.2, 0.2]);
});

test("queryPickRatios - 1회 증가", () => {
  // given
  const gameState: GameState = {
    ...initialState,
    mutations: [{ target: "prob", index: 0, value: 0.1, remainTurn: 1 }],
  };

  // when
  const pickRatios = queryPickRatios(gameState);

  // then
  assert.equal(
    postProcessPickRatios(pickRatios),
    [0.3, 0.175, 0.175, 0.175, 0.175]
  );
});

test("queryPickRatios - 1회 증가 1회 감소", () => {
  // given
  const gameState: GameState = {
    ...initialState,
    mutations: [
      { target: "prob", index: 0, value: 0.1, remainTurn: 1 },
      { target: "prob", index: 0, value: -0.1, remainTurn: 1 },
    ],
  };

  // when
  const pickRatios = queryPickRatios(gameState);

  // then
  assert.equal(postProcessPickRatios(pickRatios), [0.2, 0.2, 0.2, 0.2, 0.2]);
});

test("queryPickRatios - 100% 증가", () => {
  // given
  const gameState: GameState = {
    ...initialState,
    mutations: [{ target: "prob", index: 0, value: 1, remainTurn: 1 }],
  };

  // when
  const pickRatios = queryPickRatios(gameState);

  // then
  assert.equal(postProcessPickRatios(pickRatios), [1, 0, 0, 0, 0]);
});

test("queryPickRatios - 100% 감소", () => {
  // given
  const gameState: GameState = {
    ...initialState,
    mutations: [{ target: "prob", index: 0, value: -1, remainTurn: 1 }],
  };

  // when
  const pickRatios = queryPickRatios(gameState);

  // then
  assert.equal(postProcessPickRatios(pickRatios), [0, 0.25, 0.25, 0.25, 0.25]);
});

test("queryPickRatios - complex", () => {
  // given
  const gameState: GameState = {
    ...initialState,
    mutations: [
      { target: "prob", index: 3, value: 0.05, remainTurn: 1 },
      { target: "prob", index: 1, value: -0.05, remainTurn: 1 },
      { target: "prob", index: 0, value: -0.1, remainTurn: 1 },
      { target: "prob", index: 3, value: 0.7, remainTurn: 1 },
    ],
  };

  // when
  const pickRatios = queryPickRatios(gameState);

  // then
  assert.equal(
    postProcessPickRatios(pickRatios),
    [0.00020925, 0.00032679, 0.00047304, 0.99851787, 0.00047304]
  );
});

test("queryPickRatios - complex 2", () => {
  // given
  const gameState: GameState = {
    ...getInitialGameState({ maxEnchant: 10, totalTurn: 14 }),
    effects: [
      {
        name: "민첩",
        value: 1,
        isLocked: true,
      },
      {
        name: "무력화",
        value: 10,
        isLocked: false,
      },
      {
        name: "자원의 축복",
        value: 3,
        isLocked: false,
      },
      {
        name: "보스 피해",
        value: 0,
        isLocked: true,
      },
      {
        name: "무기 공격력",
        value: 1,
        isLocked: true,
      },
    ],
    mutations: [
      {
        target: "prob",
        index: 2,
        value: -0.05,
        remainTurn: 89,
      },
    ],
  };

  // when
  const pickRatios = queryPickRatios(gameState);

  // then
  assert.equal(postProcessPickRatios(pickRatios), [0, 0, 1, 0, 0]);
});

test("queryPickRatios - complex 3", () => {
  // given
  const gameState: GameState = {
    ...getInitialGameState({ maxEnchant: 10, totalTurn: 14 }),
    effects: [
      {
        name: "민첩",
        value: 0,
        isLocked: true,
      },
      {
        name: "무력화",
        value: 0,
        isLocked: true,
      },
      {
        name: "자원의 축복",
        value: 0,
        isLocked: false,
      },
      {
        name: "보스 피해",
        value: 9,
        isLocked: false,
      },
      {
        name: "무기 공격력",
        value: 1,
        isLocked: false,
      },
    ],
    mutations: [
      {
        target: "enchantEffectCount",
        index: -1,
        value: 2,
        remainTurn: 1,
      },
    ],
  };

  // when
  const pickRatios = queryPickRatios(gameState);

  // then
  assert.equal(postProcessPickRatios(pickRatios), [0, 0, 1, 0, 0]);
});

test.run();
