import { councilRecord } from "../data/council";
import * as Sage from "./sage";
import * as Council from "./council";

export type T = readonly Sage.T[];

export type Action =
  | {
      type: "updatePower";
      selectedIndex: number;
    }
  | {
      type: "exhaust";
      index: number;
    }
  | {
      type: "setCouncils";
      councils: string[];
    };

export function reducer(state: T, action: Action): T {
  switch (action.type) {
    case "updatePower":
      return state.map((sage, index) =>
        Sage.reducer(sage, {
          type: "updatePower",
          isSelected: action.selectedIndex === index,
        })
      );
    case "exhaust":
      return state.map((sage, index) =>
        index === action.index ? Sage.reducer(sage, action) : sage
      );
    case "setCouncils":
      return state.map((sage, index) =>
        Sage.reducer(sage, {
          type: "setCouncil",
          councilId: action.councils[index],
        })
      );
    default:
      return state;
  }
}

// queries
function getSelectableSageIndices(sageGroup: T) {
  return Array.from({ length: sageGroup.length }, (_, index) => index).filter(
    (i) => !sageGroup[i].isExhausted
  );
}

function getCouncilId(sageGroup: T, index: number) {
  return sageGroup[index].councilId;
}

function getCouncil(sageGroup: T, index: number) {
  const council = councilRecord[getCouncilId(sageGroup, index)];
  if (!council) {
    throw new Error("Invalid council id");
  }
  return council;
}

function isCouncilRestart(sageGroup: T, index: number) {
  const council = getCouncil(sageGroup, index);
  return council.logics.some((logic) => logic.type === "restart");
}

function isEffectSelectionRequired(
  sageGroup: T,
  index: number | null
): boolean {
  if (index === null) {
    return false;
  }

  const sage = sageGroup[index];
  const logics = Council.getLogicsFromId(sage.councilId);

  return logics.some((logic) => logic.targetType === "userSelect");
}

export const query = {
  getSelectableSageIndices,
  getCouncilId,
  getCouncil,
  isCouncilRestart,
  isEffectSelectionRequired,
};

// consructors
export function createInitialState(): T {
  return [
    Sage.createInitialState(),
    Sage.createInitialState(),
    Sage.createInitialState(),
  ];
}
