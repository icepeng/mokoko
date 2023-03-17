import { councils } from "./data/council";
import { effectLevelTable } from "./data/effect";

import * as Effect from "./model/effect";
import * as Sage from "./model/sage";
import * as SageGroup from "./model/sage-group";
import * as GameState from "./model/game-state";
import * as Game from "./model/game";
import * as Board from "./model/board";
import * as Council from "./model/council";

const data = {
  councils,
  effectLevelTable,
};

export { Effect, Sage, SageGroup, GameState, Game, Board, Council, data };
