import { test } from "uvu";
import * as assert from "uvu/assert";
import * as Logic from "../src/model/logic";
import { createRng } from "../src/model/rng";
import type * as GameState from "../src/model/game-state";

const rng = createRng(0);

test("shuffle", () => {
  const rngMock = {
    ...rng,
    shuffle: <T>(arr: T[]) => [4, 3, 1, 0] as T[],
  };
  const reducer = Logic.createReducer({
    rng: rngMock,
    config: { maxEnchant: 10, totalTurn: 14 },
  });

  // given
  const state = {
    config: { maxEnchant: 10 },
    board: [
      { value: 1, isSealed: false },
      { value: 10, isSealed: false },
      { value: 3, isSealed: true },
      { value: 4, isSealed: false },
      { value: 5, isSealed: false },
    ],
  } as unknown as GameState.T;

  // when
  const nextState = reducer(state, {
    logic: {
      type: "shuffleAll",
      value: [0, 0],
      ratio: 0,
      remainTurn: 1,
    },
    targets: [],
  });

  // then
  assert.equal(nextState.board, [
    { value: 5, isSealed: false },
    { value: 4, isSealed: false },
    { value: 3, isSealed: true },
    { value: 10, isSealed: false },
    { value: 1, isSealed: false },
  ]);
});

test("increaseMaxAndDecreaseTarget", () => {
  const reducer = Logic.createReducer({
    rng,
    config: { maxEnchant: 10, totalTurn: 14 },
  });

  // given
  const state = {
    config: { maxEnchant: 10 },
    board: [
      { value: 1, isSealed: false },
      { value: 3, isSealed: false },
      { value: 0, isSealed: true },
      { value: 0, isSealed: false },
      { value: 0, isSealed: false },
    ],
  } as unknown as GameState.T;

  // when
  const nextState = reducer(state, {
    logic: {
      type: "increaseMaxAndDecreaseTarget",
      value: [2, 0],
      ratio: 0,
      remainTurn: 1,
    },
    targets: [],
  });

  // then
  assert.equal(nextState.board, [
    { value: 1, isSealed: false },
    { value: 5, isSealed: false },
    { value: 0, isSealed: true },
    { value: 0, isSealed: false },
    { value: 0, isSealed: false },
  ]);
});

test("setValueRanged", () => {
  const rngMock = {
    ...rng,
    integer: () => 6,
  };
  const reducer = Logic.createReducer({
    rng: rngMock,
    config: { maxEnchant: 10, totalTurn: 14 },
  });

  // given
  const state = {
    config: { maxEnchant: 10 },
    board: [
      { value: 6, isSealed: false },
      { value: 2, isSealed: true },
      { value: 1, isSealed: false },
      { value: 3, isSealed: false },
      { value: 1, isSealed: true },
    ],
  } as unknown as GameState.T;

  // when
  const nextState = reducer(state, {
    logic: {
      type: "setValueRanged",
      value: [5, 6],
      ratio: 0,
      remainTurn: 1,
    },
    targets: [0],
  });

  // then
  assert.equal(nextState.board, [
    { value: 6, isSealed: false },
    { value: 2, isSealed: true },
    { value: 1, isSealed: false },
    { value: 3, isSealed: false },
    { value: 1, isSealed: true },
  ]);
});

test("swapMinMax", () => {
  const reducer = Logic.createReducer({
    rng,
    config: { maxEnchant: 10, totalTurn: 14 },
  });

  // given
  const state = {
    config: { maxEnchant: 10 },
    board: [
      { value: 2, isSealed: false },
      { value: 0, isSealed: true },
      { value: 3, isSealed: false },
      { value: 2, isSealed: false },
      { value: 0, isSealed: false },
    ],
  } as unknown as GameState.T;

  // when
  const nextState = reducer(state, {
    logic: {
      type: "swapMinMax",
      value: [0, 0],
      ratio: 0,
      remainTurn: 1,
    },
    targets: [],
  });

  // then
  assert.equal(nextState.board, [
    { value: 2, isSealed: false },
    { value: 0, isSealed: true },
    { value: 0, isSealed: false },
    { value: 2, isSealed: false },
    { value: 3, isSealed: false },
  ]);
});

test("unsealAndSealOther", () => {
  const rngMock = {
    ...rng,
    pickone: <T>(arr: T[]) => arr[0],
  };
  const reducer = Logic.createReducer({
    rng: rngMock,
    config: { maxEnchant: 10, totalTurn: 14 },
  });

  // given
  const state = {
    config: { maxEnchant: 10 },
    board: [
      { value: 1, isSealed: true },
      { value: 1, isSealed: false },
      { value: 3, isSealed: false },
      { value: 5, isSealed: false },
      { value: 2, isSealed: false },
    ],
  } as unknown as GameState.T;

  // when
  const nextState = reducer(state, {
    logic: {
      type: "unsealAndSealOther",
      value: [0, 0],
      ratio: 0,
      remainTurn: 1,
    },
    targets: [],
  });

  // then
  assert.equal(nextState.board, [
    { value: 1, isSealed: false },
    { value: 1, isSealed: true },
    { value: 3, isSealed: false },
    { value: 5, isSealed: false },
    { value: 2, isSealed: false },
  ]);
});

test("shiftAll - up", () => {
  const reducer = Logic.createReducer({
    rng,
    config: { maxEnchant: 10, totalTurn: 14 },
  });

  // given
  const state = {
    config: { maxEnchant: 10 },
    board: [
      { value: 1, isSealed: true },
      { value: 1, isSealed: false },
      { value: 3, isSealed: false },
      { value: 5, isSealed: false },
      { value: 2, isSealed: false },
    ],
  } as unknown as GameState.T;

  // when
  const nextState = reducer(state, {
    logic: {
      type: "shiftAll",
      value: [0, 0],
      ratio: 0,
      remainTurn: 1,
    },
    targets: [],
  });

  // then
  assert.equal(nextState.board, [
    { value: 1, isSealed: true },
    { value: 3, isSealed: false },
    { value: 5, isSealed: false },
    { value: 2, isSealed: false },
    { value: 1, isSealed: false },
  ]);
});

test("shiftAll - down", () => {
  const reducer = Logic.createReducer({
    rng,
    config: { maxEnchant: 10, totalTurn: 14 },
  });

  // given
  const state = {
    config: { maxEnchant: 10 },
    board: [
      { value: 1, isSealed: true },
      { value: 1, isSealed: false },
      { value: 3, isSealed: false },
      { value: 5, isSealed: false },
      { value: 2, isSealed: false },
    ],
  } as unknown as GameState.T;

  // when
  const nextState = reducer(state, {
    logic: {
      type: "shiftAll",
      value: [1, 0],
      ratio: 0,
      remainTurn: 1,
    },
    targets: [],
  });

  // then
  assert.equal(nextState.board, [
    { value: 1, isSealed: true },
    { value: 2, isSealed: false },
    { value: 1, isSealed: false },
    { value: 3, isSealed: false },
    { value: 5, isSealed: false },
  ]);
});

test("exhaust", () => {
  const reducer = Logic.createReducer({
    rng,
    config: { maxEnchant: 10, totalTurn: 14 },
  });

  // given
  const state = {
    config: { maxEnchant: 10 },
    board: [
      { value: 1, isSealed: true },
      { value: 1, isSealed: false },
      { value: 3, isSealed: false },
      { value: 5, isSealed: false },
      { value: 2, isSealed: false },
    ],
    sageGroup: [
      {
        index: 0,
        isExhausted: false,
      },
      {
        index: 1,
        isExhausted: false,
      },
      {
        index: 2,
        isExhausted: false,
      },
    ],
  } as unknown as GameState.T;

  // when
  const nextState = reducer(state, {
    logic: {
      type: "exhaust",
      value: [1, 0],
      ratio: 0,
      remainTurn: 1,
    },
    targets: [],
  });

  // then
  assert.equal(nextState.sageGroup, [
    {
      index: 0,
      isExhausted: true,
    },
    {
      index: 1,
      isExhausted: false,
    },
    {
      index: 2,
      isExhausted: false,
    },
  ]);
});

test.run();
