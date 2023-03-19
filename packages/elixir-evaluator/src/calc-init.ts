import fs from "fs";
import path from "path";
import { createScoreCalculator } from "./calc";

const adviceCounting = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./data/advice_counting.json"), "utf8")
);
const curveCounting = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./data/curve_counting.json"), "utf8")
);
export const scoreCalculator = createScoreCalculator({
  adviceCounting,
  curveCounting,
});
