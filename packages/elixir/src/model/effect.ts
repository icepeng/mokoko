import { effectLevelTable } from "../data/effect";
import { Config } from "./config";
import { Context } from "./context";

export interface T {
  name: string;
  value: number;
  isSealed: boolean;
}

export type Action =
  | {
      type: "setValue";
      value: number;
    }
  | {
      type: "seal";
    }
  | {
      type: "unseal";
    };

export function reducer(state: T, action: Action, { config }: Context): T {
  switch (action.type) {
    case "setValue":
      const value = action.value;
      if (state.isSealed && state.value !== value) {
        throw new Error("Effect is sealed");
      }
      if (value < 0) {
        throw new Error("Effect value must be positive");
      }
      if (value > config.maxEnchant) {
        throw new Error("Effect value is higher than max enchant");
      }

      return {
        ...state,
        value,
      };
    case "seal":
      if (state.isSealed) {
        throw new Error("Effect is already sealed");
      }
      return {
        ...state,
        isSealed: true,
      };
    case "unseal":
      if (!state.isSealed) {
        throw new Error("Effect is already unsealed");
      }
      return {
        ...state,
        isSealed: false,
      };
    default:
      return state;
  }
}

// queries
function isMutable(effect: T, maxEnchant: number) {
  return effect.isSealed === false && effect.value < maxEnchant;
}

function isSealed(effect: T) {
  return effect.isSealed;
}

function isUnsealed(effect: T) {
  return !effect.isSealed;
}

function getLevel(effect: T) {
  const value = effect.value;
  if (value < 0 || value > 10) {
    throw new Error(`Invalid effect value: ${value}`);
  }

  return effectLevelTable[value as keyof typeof effectLevelTable];
}

export const query = {
  isMutable,
  isSealed,
  isUnsealed,
  getLevel,
};

// constructors
export function createInitialState(name: string): T {
  return { name, value: 0, isSealed: false };
}
