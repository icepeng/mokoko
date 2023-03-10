import { test } from "uvu";
import * as assert from "uvu/assert";
import { SageState, SageType } from "../src/interface";
import { updatePowers } from "../src/sage";

function sage(type: SageType, power: number): SageState {
  return {
    type,
    power,
    isExhausted: false,
    councilId: "",
  };
}

test("updatePowers - 최초 상태", () => {
  // given
  const sageStates: SageState[] = [
    sage("none", 0),
    sage("none", 0),
    sage("none", 0),
  ];

  // when
  const updatedState = updatePowers(sageStates, 0);

  // then
  assert.is(updatedState[0].type, "lawful");
  assert.is(updatedState[0].power, 1);
});

test("updatePowers - 혼돈 선택", () => {
  // given
  const sageStates: SageState[] = [
    sage("chaos", 4),
    sage("chaos", 5),
    sage("lawful", 2),
  ];

  // when
  const updatedState = updatePowers(sageStates, 0);

  // then
  assert.is(updatedState[0].type, "lawful");
  assert.is(updatedState[0].power, 1);

  assert.is(updatedState[1].type, "chaos");
  assert.is(updatedState[1].power, 6);

  assert.is(updatedState[2].type, "chaos");
  assert.is(updatedState[2].power, 1);
});

test("updatePowers - 풀스택 미선택 초기화", () => {
  // given
  const sageStates: SageState[] = [
    sage("chaos", 4),
    sage("chaos", 6),
    sage("lawful", 2),
  ];

  // when
  const updatedState = updatePowers(sageStates, 0);

  // then
  assert.is(updatedState[0].type, "lawful");
  assert.is(updatedState[0].power, 1);

  assert.is(updatedState[1].type, "chaos");
  assert.is(updatedState[1].power, 1);

  assert.is(updatedState[2].type, "chaos");
  assert.is(updatedState[2].power, 1);
});

test("updatePowers - 혼돈 풀스택 선택 초기화", () => {
  // given
  const sageStates: SageState[] = [
    sage("chaos", 4),
    sage("chaos", 6),
    sage("lawful", 2),
  ];

  // when
  const updatedState = updatePowers(sageStates, 1);

  // then
  assert.is(updatedState[0].type, "chaos");
  assert.is(updatedState[0].power, 5);

  assert.is(updatedState[1].type, "lawful");
  assert.is(updatedState[1].power, 1);

  assert.is(updatedState[2].type, "chaos");
  assert.is(updatedState[2].power, 1);
});

test("updatePowers - 질서 풀스택 선택 초기화", () => {
  // given
  const sageStates: SageState[] = [
    sage("chaos", 3),
    sage("chaos", 3),
    sage("lawful", 3),
  ];

  // when
  const updatedState = updatePowers(sageStates, 2);

  // then
  assert.is(updatedState[0].type, "chaos");
  assert.is(updatedState[0].power, 4);

  assert.is(updatedState[1].type, "chaos");
  assert.is(updatedState[1].power, 4);

  assert.is(updatedState[2].type, "lawful");
  assert.is(updatedState[2].power, 1);
});

test.run();
