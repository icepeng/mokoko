import { clamp } from "../util";
import { Context } from "./context";
import * as Effect from "./effect";

export type T = readonly Effect.T[];

export type Action =
  | {
      type: "setValue";
      index: number;
      value: number;
    }
  | {
      type: "increaseValue";
      index: number;
      diff: number;
    }
  | {
      type: "setValues";
      values: number[];
    }
  | {
      type: "increaseValues";
      diffs: number[];
    }
  | {
      type: "seal";
      index: number;
    }
  | {
      type: "unseal";
      index: number;
    };

export function reducer(state: T, action: Action, ctx: Context): T {
  const maxEnchant = ctx.config.maxEnchant;
  switch (action.type) {
    case "seal":
    case "unseal":
      return state.map((eff, index) =>
        index === action.index ? Effect.reducer(eff, action, ctx) : eff
      );
    case "setValue":
      return state.map((eff, index) =>
        index === action.index
          ? Effect.reducer(
              eff,
              {
                type: "setValue",
                value: clamp(eff.value + action.value, maxEnchant),
              },
              ctx
            )
          : eff
      );
    case "increaseValue":
      return state.map((eff, index) =>
        index === action.index
          ? Effect.reducer(
              eff,
              {
                type: "setValue",
                value: clamp(eff.value + action.diff, maxEnchant),
              },
              ctx
            )
          : eff
      );
    case "setValues":
      return state.map((eff, index) =>
        Effect.reducer(
          eff,
          {
            type: "setValue",
            value: clamp(action.values[index], maxEnchant),
          },
          ctx
        )
      );
    case "increaseValues":
      return state.map((eff, index) =>
        Effect.reducer(
          eff,
          {
            type: "setValue",
            value: clamp(eff.value + action.diffs[index], maxEnchant),
          },
          ctx
        )
      );
    default:
      return state;
  }
}

export const reducerC = (ctx: Context) => (action: Action) => (state: T) =>
  reducer(state, action, ctx);

// queries
function getMutableCount(board: T, maxEnchant: number) {
  return board.filter((eff) => Effect.query.isMutable(eff, maxEnchant)).length;
}

function getSealedIndices(board: T) {
  return board
    .map((eff, index) => (Effect.query.isSealed(eff) ? index : null))
    .filter((index) => index !== null) as number[];
}

function getUnsealedIndices(board: T) {
  return board
    .map((eff, index) => (Effect.query.isUnsealed(eff) ? index : null))
    .filter((index) => index !== null) as number[];
}

function isIndexMutable(board: T, index: number, maxEnchant: number) {
  return Effect.query.isMutable(board[index], maxEnchant);
}

function getSelectableEffectIndices(board: T) {
  return Array.from({ length: board.length }, (_, i) => i).filter(
    (i) => !board[i].isSealed
  );
}

function isIndexSealed(board: T, index: number) {
  return Effect.query.isSealed(board[index]);
}

function getSealedCount(board: T) {
  return board.filter(Effect.query.isSealed).length;
}

function getValue(board: T, index: number) {
  return board[index].value;
}

function getValues(board: T) {
  return board.map((eff) => eff.value);
}

function getUnsealedMaxValueIndices(board: T) {
  const maxValue = Math.max(
    ...board.filter(Effect.query.isUnsealed).map((eff) => eff.value)
  );
  return [
    maxValue,
    board
      .map((eff, i) => (eff.value === maxValue && !eff.isSealed ? i : null))
      .filter((i) => i !== null) as number[],
  ] as const;
}

function getUnsealedMinValueIndices(board: T) {
  const minValue = Math.min(
    ...board.filter(Effect.query.isUnsealed).map((eff) => eff.value)
  );
  return [
    minValue,
    board
      .map((eff, i) => (eff.value === minValue && !eff.isSealed ? i : null))
      .filter((i) => i !== null) as number[],
  ] as const;
}

function getTotalUnsealedValue(board: T) {
  return board
    .filter((eff) => !eff.isSealed)
    .reduce((acc, effect) => acc + effect.value, 0);
}

function getLevels(board: T) {
  return board.map(Effect.query.getLevel);
}

function getLevel(board: T, index: number) {
  return Effect.query.getLevel(board[index]);
}

function getNames(board: T) {
  return board.map((eff) => eff.name);
}

export const query = {
  getMutableCount,
  getSealedIndices,
  getUnsealedIndices,
  isIndexMutable,
  getSelectableEffectIndices,
  isIndexSealed,
  getSealedCount,
  getValue,
  getValues,
  getUnsealedMaxValueIndices,
  getUnsealedMinValueIndices,
  getTotalUnsealedValue,
  getLevels,
  getLevel,
  getNames,
};

// constructors
export function createInitialState(names: string[]): T {
  return names.map((name) => Effect.createInitialState(name));
}
