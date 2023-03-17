import { Config } from "./config";
import { Rng } from "./rng";

export interface Context {
  config: Config;
  rng: Rng;
}
