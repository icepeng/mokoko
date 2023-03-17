import * as Board from "./board";
import { Context } from "./context";
import { CouncilType } from "./council";
import * as Mutation from "./mutation";
import * as Sage from "./sage";
import * as SageGroup from "./sage-group";

export interface T {
  turnLeft: number;
  turnPassed: number;
  rerollLeft: number;
  board: Board.T;
  mutations: Mutation.T[];
  sageGroup: SageGroup.T;
  shouldRestart: boolean;
}

export type Action =
  | {
      type: "decreaseTurn";
      amount: number;
    }
  | {
      type: "passTurn";
      selectedSageIndex: number;
    }
  | {
      type: "increaseRerollLeft";
      amount: number;
    }
  | {
      type: "decreaseRerollLeft";
    }
  | {
      type: "addMutations";
      mutations: Mutation.T[];
    }
  | {
      type: "markAsRestart";
    };

export function reducer(state: T, action: Action): T {
  switch (action.type) {
    case "decreaseTurn":
      if (state.turnLeft <= 0) {
        throw new Error("No turn left");
      }
      return {
        ...state,
        turnLeft: state.turnLeft - action.amount,
      };
    case "passTurn":
      if (state.turnLeft <= 0) {
        throw new Error("No turn left");
      }

      return {
        ...state,
        turnLeft: state.turnLeft - 1,
        turnPassed: state.turnPassed + 1,
        mutations: state.mutations
          .map((mutation) => Mutation.reducer(mutation, { type: "passTurn" }))
          .filter((mutation) => mutation.remainTurn > 0),
        sageGroup: SageGroup.reducer(state.sageGroup, {
          type: "updatePower",
          selectedIndex: action.selectedSageIndex,
        }),
      };
    case "increaseRerollLeft":
      return {
        ...state,
        rerollLeft: state.rerollLeft + action.amount,
      };
    case "decreaseRerollLeft":
      if (state.rerollLeft <= 0) {
        throw new Error("No reroll left");
      }
      return {
        ...state,
        rerollLeft: state.rerollLeft - 1,
      };
    case "addMutations":
      return {
        ...state,
        mutations: [...state.mutations, ...action.mutations],
      };
    case "markAsRestart":
      return {
        ...state,
        shouldRestart: true,
      };
    default:
      return state;
  }
}

export function boardReducer(state: T, action: Board.Action, ctx: Context): T {
  return {
    ...state,
    board: Board.reducer(state.board, action, ctx),
  };
}

export function sageGroupReducer(state: T, action: SageGroup.Action): T {
  return {
    ...state,
    sageGroup: SageGroup.reducer(state.sageGroup, action),
  };
}

// queries
function checkSealNeeded(state: T) {
  const sealedEffectCount = state.board.filter(
    (effect) => effect.isSealed
  ).length;
  const toSeal = 3 - sealedEffectCount;

  return state.turnLeft <= toSeal;
}

function getCouncilType(state: T, sageIndex: number): CouncilType {
  const sage = state.sageGroup[sageIndex];
  const isSealNeeded = checkSealNeeded(state);

  if (sage.isExhausted) {
    return "exhausted";
  }

  if (Sage.query.isLawfulFull(sage)) {
    if (isSealNeeded) {
      return "lawfulSeal";
    }

    return "lawful";
  }

  if (Sage.query.isChaosFull(sage)) {
    if (isSealNeeded) {
      return "chaosSeal";
    }

    return "chaos";
  }

  if (isSealNeeded) {
    return "seal";
  }

  return "common";
}

function isTurnInRange(state: T, [min, max]: [number, number]) {
  if (min === 0) {
    return true;
  }

  return state.turnPassed >= min && state.turnPassed < max;
}

function getCouncilDescription(state: T, sageIndex: number) {
  const council = SageGroup.query.getCouncil(state.sageGroup, sageIndex);

  const effectNames = Board.query.getNames(state.board);
  return council.descriptions[sageIndex]
    .replaceAll("{0}", effectNames[0])
    .replaceAll("{1}", effectNames[1])
    .replaceAll("{2}", effectNames[2])
    .replaceAll("{3}", effectNames[3])
    .replaceAll("{4}", effectNames[4]);
}

export const query = {
  checkSealNeeded,
  getCouncilType,
  isTurnInRange,
  getCouncilDescription,
};

// constructors
export function createInitialState(turnLeft: number, effectNames: string[]): T {
  return {
    turnLeft,
    turnPassed: 0,
    rerollLeft: 2,
    sageGroup: SageGroup.createInitialState(),
    board: Board.createInitialState(effectNames),
    mutations: [],
    shouldRestart: false,
  };
}
