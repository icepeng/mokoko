import { partition } from "../src/council/util";
import { test } from "uvu";
import * as assert from "uvu/assert";

test("partition", () => {
  // given
  const n = 3;
  const k = 5;
  const lockedValues = [null, 3, null, null, null];

  // when
  const result = partition(3, 5, lockedValues);

  // then
  assert.equal(result, [[0, 3, 0, 0, 0]]);
});

test.run();
