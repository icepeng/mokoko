import fs from "fs";
import path from "path";
import { createScoreCalculator } from "./calc";

const adviceCounting = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./data/advice_counting.json"), "utf8")
);
const curveRank12 = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "./data/curve_rank_12_indexed.json"),
    "utf8"
  )
);
const curveProb12 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./data/curve_prob_12.json"), "utf8")
);
const curveRank13 = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "./data/curve_rank_13_indexed.json"),
    "utf8"
  )
);
const curveProb13 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./data/curve_prob_13.json"), "utf8")
);
const curveRank14 = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "./data/curve_rank_14_indexed.json"),
    "utf8"
  )
);
const curveProb14 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./data/curve_prob_14.json"), "utf8")
);
const curveRank15 = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "./data/curve_rank_15_indexed.json"),
    "utf8"
  )
);
const curveProb15 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./data/curve_prob_15.json"), "utf8")
);

export const scoreCalculator = createScoreCalculator({
  adviceCounting,
  curveRankRecord: {
    12: curveRank12,
    13: curveRank13,
    14: curveRank14,
    15: curveRank15,
  },
  curveProbRecord: {
    12: curveProb12,
    13: curveProb13,
    14: curveProb14,
    15: curveProb15,
  },
});
