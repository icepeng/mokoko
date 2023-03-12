import { test } from "uvu";
import * as assert from "uvu/assert";
import sageEntity, { SageState, SageType } from "../src/model/sage";

function sage(index: 0 | 1 | 2, type: SageType, power: number): SageState {
  return {
    index,
    type,
    power,
    isExhausted: false,
    councilId: "",
  };
}

function updatePowers(sages: SageState[], selectedIndex: number): SageState[] {
  return sages.map((sage) => sageEntity.updatePower(sage, selectedIndex));
}

test("updatePowers - 최초 상태", () => {
  // given
  const sageStates: SageState[] = [
    sage(0, "none", 0),
    sage(1, "none", 0),
    sage(2, "none", 0),
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
    sage(0, "chaos", 4),
    sage(1, "chaos", 5),
    sage(2, "lawful", 2),
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
    sage(0, "chaos", 4),
    sage(1, "chaos", 6),
    sage(2, "lawful", 2),
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
    sage(0, "chaos", 4),
    sage(1, "chaos", 6),
    sage(2, "lawful", 2),
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
    sage(0, "chaos", 3),
    sage(1, "chaos", 3),
    sage(2, "lawful", 3),
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
