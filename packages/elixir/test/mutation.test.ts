import { test } from "uvu";
import * as assert from "uvu/assert";
import * as GameState from "../src/model/game-state";

const initialState = GameState.createInitialState(14, [
  "A",
  "B",
  "C",
  "D",
  "E",
]);

const queryPickRatios = GameState.query.getPickRatios;

function round(num: number, precision: number) {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

function postProcessPickRatios(pickRatios: number[]) {
  return pickRatios.map((rate) => round(rate, 8));
}

test("queryPickRatios - 최초 상태", () => {
  // given
  const gameState: GameState.T = { ...initialState };

  // when
  const pickRatios = queryPickRatios(gameState, 10);

  // then
  assert.equal(postProcessPickRatios(pickRatios), [0.2, 0.2, 0.2, 0.2, 0.2]);
});

test("queryPickRatios - 1회 증가", () => {
  // given
  const gameState: GameState.T = {
    ...initialState,
    mutations: [{ target: "prob", index: 0, value: 0.1, remainTurn: 1 }],
  };

  // when
  const pickRatios = queryPickRatios(gameState, 10);

  // then
  assert.equal(
    postProcessPickRatios(pickRatios),
    [0.3, 0.175, 0.175, 0.175, 0.175]
  );
});

test("queryPickRatios - 1회 증가 1회 감소", () => {
  // given
  const gameState: GameState.T = {
    ...initialState,
    mutations: [
      { target: "prob", index: 0, value: 0.1, remainTurn: 1 },
      { target: "prob", index: 0, value: -0.1, remainTurn: 1 },
    ],
  };

  // when
  const pickRatios = queryPickRatios(gameState, 10);

  // then
  assert.equal(postProcessPickRatios(pickRatios), [0.2, 0.2, 0.2, 0.2, 0.2]);
});

test("queryPickRatios - 100% 증가", () => {
  // given
  const gameState: GameState.T = {
    ...initialState,
    mutations: [{ target: "prob", index: 0, value: 1, remainTurn: 1 }],
  };

  // when
  const pickRatios = queryPickRatios(gameState, 10);

  // then
  assert.equal(postProcessPickRatios(pickRatios), [1, 0, 0, 0, 0]);
});

test("queryPickRatios - 100% 감소", () => {
  // given
  const gameState: GameState.T = {
    ...initialState,
    mutations: [{ target: "prob", index: 0, value: -1, remainTurn: 1 }],
  };

  // when
  const pickRatios = queryPickRatios(gameState, 10);

  // then
  assert.equal(postProcessPickRatios(pickRatios), [0, 0.25, 0.25, 0.25, 0.25]);
});

test("queryPickRatios - complex", () => {
  // given
  const gameState: GameState.T = {
    ...initialState,
    mutations: [
      { target: "prob", index: 3, value: 0.05, remainTurn: 1 },
      { target: "prob", index: 1, value: -0.05, remainTurn: 1 },
      { target: "prob", index: 0, value: -0.1, remainTurn: 1 },
      { target: "prob", index: 3, value: 0.7, remainTurn: 1 },
    ],
  };

  // when
  const pickRatios = queryPickRatios(gameState, 10);

  // then
  assert.equal(
    postProcessPickRatios(pickRatios),
    [0.00020925, 0.00032679, 0.00047304, 0.99851787, 0.00047304]
  );
});

test("queryPickRatios - complex 2", () => {
  // given
  const gameState: GameState.T = {
    ...initialState,
    board: [
      {
        name: "민첩",
        value: 1,
        isSealed: true,
      },
      {
        name: "무력화",
        value: 10,
        isSealed: false,
      },
      {
        name: "자원의 축복",
        value: 3,
        isSealed: false,
      },
      {
        name: "보스 피해",
        value: 0,
        isSealed: true,
      },
      {
        name: "무기 공격력",
        value: 1,
        isSealed: true,
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
  const pickRatios = queryPickRatios(gameState, 10);

  // then
  assert.equal(postProcessPickRatios(pickRatios), [0, 0, 1, 0, 0]);
});

test("increase after 100%", () => {
  // given
  const gameState: GameState.T = {
    ...initialState,
    board: [
      { name: "보스 피해", value: 3, isSealed: false },
      { name: "무기 공격력", value: 1, isSealed: false },
      { name: "민첩", value: 1, isSealed: false },
      { name: "자원의 축복", value: 0, isSealed: false },
      { name: "무력화", value: 0, isSealed: false },
    ],
    mutations: [
      { target: "prob", index: 1, value: 1, remainTurn: 1 },
      { target: "prob", index: 1, value: 1, remainTurn: 1 },
    ],
  };

  // when
  const pickRatios = queryPickRatios(gameState, 10);

  // then
  assert.equal(postProcessPickRatios(pickRatios), [0, 1, 0, 0, 0]);
});

test("should not apply mutation to sealed effect", () => {
  // given
  const gameState: GameState.T = {
    ...initialState,
    board: [
      {
        name: "자원의 축복",
        value: 2,
        isSealed: true,
      },
      {
        name: "무기 공격력",
        value: 0,
        isSealed: false,
      },
      {
        name: "민첩",
        value: 5,
        isSealed: false,
      },
      {
        name: "보스 피해",
        value: 0,
        isSealed: false,
      },
      {
        name: "무력화",
        value: 3,
        isSealed: false,
      },
    ],
    mutations: [
      {
        target: "prob",
        index: 0,
        value: 0.1,
        remainTurn: 92,
      },
      {
        target: "prob",
        index: 0,
        value: 0.05,
        remainTurn: 93,
      },
    ],
  };

  // when
  const pickRatios = queryPickRatios(gameState, 10);

  // then
  assert.equal(postProcessPickRatios(pickRatios), [0, 0.25, 0.25, 0.25, 0.25]);
});

test.run();
