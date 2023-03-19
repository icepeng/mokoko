import { test } from "uvu";
import * as assert from "uvu/assert";
import { Effect } from "../src";
import { GameState } from "../src/model/game";

const initialState = GameState.createInitialState({
  maxEnchant: 10,
  totalTurn: 14,
});

function createEffects(data: [number, boolean][]): Effect[] {
  return data.map(([value, isSealed], index) => ({
    value,
    isSealed,
    optionName: "",
    index,
  }));
}

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
  const pickRatios = GameState.query.getPickRatios(gameState);

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
  const pickRatios = GameState.query.getPickRatios(gameState);

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
  const pickRatios = GameState.query.getPickRatios(gameState);

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
  const pickRatios = GameState.query.getPickRatios(gameState);

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
  const pickRatios = GameState.query.getPickRatios(gameState);

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
  const pickRatios = GameState.query.getPickRatios(gameState);

  // then
  assert.equal(
    postProcessPickRatios(pickRatios),
    [0.00020925, 0.00032679, 0.00047304, 0.99851787, 0.00047304]
  );
});

test("queryPickRatios - complex 2", () => {
  // given
  const gameState: GameState = {
    ...initialState,
    effects: createEffects([
      [1, true],
      [10, false],
      [3, false],
      [0, true],
      [1, true],
    ]),
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
  const pickRatios = GameState.query.getPickRatios(gameState);

  // then
  assert.equal(postProcessPickRatios(pickRatios), [0, 0, 1, 0, 0]);
});

test("should not apply mutation to sealed effect", () => {
  // given
  const gameState: GameState = {
    ...initialState,
    effects: createEffects([
      [2, true],
      [0, false],
      [5, false],
      [0, false],
      [3, false],
    ]),
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
  const pickRatios = GameState.query.getPickRatios(gameState);

  // then
  assert.equal(postProcessPickRatios(pickRatios), [0, 0.25, 0.25, 0.25, 0.25]);
});

test.run();
