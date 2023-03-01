import { test } from "uvu";
import * as assert from "uvu/assert";
import { GameState } from "../src/interface";
import { queryEffectsProb } from "../src/effect";
import { getInitialGameState } from "../src";

const initialState = getInitialGameState({ maxEnchant: 10, totalTurn: 14 });

function round(num: number, precision: number) {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

function postProcessPickRates(pickRates: number[]) {
  return pickRates.map((rate) => round(rate, 8));
}

test("queryEffectsProb - 최초 상태", () => {
  // given
  const gameState: GameState = { ...initialState };

  // when
  const pickRates = queryEffectsProb(gameState);

  // then
  assert.equal(postProcessPickRates(pickRates), [0.2, 0.2, 0.2, 0.2, 0.2]);
});

test("queryEffectsProb - 1회 증가", () => {
  // given
  const gameState: GameState = {
    ...initialState,
    effectProbMutations: [{ index: 0, diff: 0.1 }],
  };

  // when
  const pickRates = queryEffectsProb(gameState);

  // then
  assert.equal(
    postProcessPickRates(pickRates),
    [0.3, 0.175, 0.175, 0.175, 0.175]
  );
});

test("queryEffectsProb - 1회 증가 1회 감소", () => {
  // given
  const gameState: GameState = {
    ...initialState,
    effectProbMutations: [
      { index: 0, diff: 0.1 },
      { index: 0, diff: -0.1 },
    ],
  };

  // when
  const pickRates = queryEffectsProb(gameState);

  // then
  assert.equal(postProcessPickRates(pickRates), [0.2, 0.2, 0.2, 0.2, 0.2]);
});

test("queryEffectsProb - 100% 증가", () => {
  // given
  const gameState: GameState = {
    ...initialState,
    effectProbMutations: [{ index: 0, diff: 1 }],
  };

  // when
  const pickRates = queryEffectsProb(gameState);

  // then
  assert.equal(postProcessPickRates(pickRates), [1, 0, 0, 0, 0]);
});

test("queryEffectsProb - 100% 감소", () => {
  // given
  const gameState: GameState = {
    ...initialState,
    effectProbMutations: [{ index: 0, diff: -1 }],
  };

  // when
  const pickRates = queryEffectsProb(gameState);

  // then
  assert.equal(postProcessPickRates(pickRates), [0, 0.25, 0.25, 0.25, 0.25]);
});

test("queryEffectsProb - complex", () => {
  // given
  const gameState: GameState = {
    ...initialState,
    effectProbMutations: [
      { index: 3, diff: 0.05 },
      { index: 1, diff: -0.05 },
      { index: 0, diff: -0.1 },
      { index: 3, diff: 0.7 },
    ],
  };

  // when
  const pickRates = queryEffectsProb(gameState);

  // then
  assert.equal(
    postProcessPickRates(pickRates),
    [0.00020925, 0.00032679, 0.00047304, 0.9985179, 0.00047304]
  );
});

test.run();
