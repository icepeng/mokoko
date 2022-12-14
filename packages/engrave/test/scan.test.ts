import * as fs from "fs";
import * as path from "path";
import { getCombinations, splitNumber } from "../src/scan";

import { test } from "uvu";
import * as assert from "uvu/assert";
import { EngraveSum } from "interface";

test("splitNumber", () => {
  const splits = splitNumber(15, 5, 3, 3);

  assert.equal(splits, [
    [3, 3, 3, 3, 3],
    [3, 3, 4, 5],
    [3, 4, 4, 4],
    [5, 5, 5],
  ]);
});

test("splitNumber - ancient 15", () => {
  const splits = splitNumber(15, 6, 4, 3);

  assert.equal(splits, [
    [3, 3, 3, 3, 3],
    [3, 3, 3, 3, 4],
    [3, 3, 3, 4, 4],
    [3, 3, 3, 6],
    [3, 3, 4, 4, 4],
    [3, 3, 4, 5],
    [3, 4, 4, 4],
    [3, 6, 6],
    [4, 4, 4, 4],
    [4, 5, 6],
    [5, 5, 5],
  ]);
});

test("splitNumber - ancient 6", () => {
  const splits = splitNumber(6, 6, 4, 3);

  assert.equal(splits, [[3, 3], [3, 4], [4, 4], [6]]);
});

test("getCombinations - relic snapshot", () => {
  const result = getCombinations({
    target: {
      원한: 3,
      "예리한 둔기": 3,
      돌격대장: 15,
      바리케이드: 8,
      아드레날린: 8,
    },
    length: 5,
    itemGrade: "유물",
  });
  const resultStr = JSON.stringify(result, null, 2);
  const snapshotPath = path.join(__dirname, "__snapshot__", "relic.json");
  // uncomment following code to generate snapshot
  // fs.writeFileSync(snapshotPath, resultStr, "utf8");

  const snapshot = fs.readFileSync(snapshotPath, "utf8");

  assert.fixture(resultStr, snapshot);
});

test("getCombinations - ancient snapshot", () => {
  const result = getCombinations({
    target: {
      원한: 3,
      "예리한 둔기": 3,
      돌격대장: 15,
      바리케이드: 8,
      아드레날린: 7,
    },
    length: 5,
    itemGrade: "고대",
  });

  const resultStr = JSON.stringify(result, null, 2);
  const snapshotPath = path.join(__dirname, "__snapshot__", "ancient.json");
  // uncomment following code to generate snapshot
  // fs.writeFileSync(snapshotPath, resultStr, "utf8");

  const snapshot = fs.readFileSync(snapshotPath, "utf8");

  assert.fixture(resultStr, snapshot);
});

const targets: EngraveSum[] = [
  {
    원한: 3,
    "예리한 둔기": 3,
    돌격대장: 15,
    바리케이드: 8,
    아드레날린: 7,
  },
  {
    "예리한 둔기": 8,
    돌격대장: 15,
    아드레날린: 8,
  },
  {
    원한: 3,
    "예리한 둔기": 3,
    돌격대장: 15,
    바리케이드: 8,
    아드레날린: 8,
    각성: 5,
  },
];

targets.forEach((target, i) => {
  test(`getCombinations - ancient should return result ${i}`, () => {
    const result = getCombinations({
      target,
      length: 5,
      itemGrade: "고대",
    });

    assert.is(result.length > 0, true);
  });

  test(`getCombinations - ancient should not have 3,3 pair ${i}`, () => {
    const result = getCombinations({
      target,
      length: 5,
      itemGrade: "고대",
    });

    const has33 = !!result
      .flat()
      .find((pair) => pair[0].amount === 3 && pair[1].amount === 3);

    assert.is(has33, false);
  });

  test(`getCombinations - ancient should not have duplication ${i}`, () => {
    const result = getCombinations({
      target,
      length: 5,
      itemGrade: "고대",
    });

    const deduped = new Set(
      result.map((combination) => JSON.stringify(combination))
    );

    const total = result.length;
    const dedupedTotal = deduped.size;

    assert.is(total, dedupedTotal);
  });

  test(`getCombinations - ancient should not have duplication in virtual ${i}`, () => {
    const result = getCombinations({
      target,
      length: 5,
      itemGrade: "고대",
    });

    result.forEach((comp) => {
      comp.forEach((x) => x.sort((a, b) => a.name.localeCompare(b.name)));
      comp.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    });

    const virtuallySame = !!result.find((first, i) => {
      return result.find((second, j) => {
        if (i === j) {
          return false;
        }

        return first.every(
          (_, k) =>
            first[k][0].name === second[k][0].name &&
            first[k][1].name === second[k][1].name &&
            first[k][0].amount >= second[k][0].amount &&
            first[k][1].amount >= second[k][1].amount
        );
      });
    });

    assert.is(virtuallySame, false);
  });
});

test.run();
