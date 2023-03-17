import { MAX_CHAOS, MAX_LAWFUL } from "../data/const";

export type SageType = "none" | "lawful" | "chaos";

export interface T {
  type: SageType;
  power: number;
  isExhausted: boolean;
  councilId: string;
}

export type Action =
  | {
      type: "updatePower";
      isSelected: boolean;
    }
  | {
      type: "exhaust";
    }
  | {
      type: "setCouncil";
      councilId: string;
    };

export function reducer(sage: T, action: Action): T {
  switch (action.type) {
    case "updatePower":
      const { isSelected } = action;
      if (sage.type === "none") {
        if (isSelected) {
          return { ...sage, type: "lawful", power: 1 };
        }
        return { ...sage, type: "chaos", power: 1 };
      }

      if (sage.type === "lawful") {
        if (isSelected) {
          return {
            ...sage,
            type: "lawful",
            power: sage.power === MAX_LAWFUL ? 1 : sage.power + 1,
          };
        }

        return {
          ...sage,
          type: "chaos",
          power: 1,
        };
      }

      if (sage.type === "chaos") {
        if (isSelected) {
          return { ...sage, type: "lawful", power: 1 };
        }

        return {
          ...sage,
          type: "chaos",
          power: sage.power === MAX_CHAOS ? 1 : sage.power + 1,
        };
      }

      throw new Error("Invalid sage type");

    case "exhaust":
      return {
        ...sage,
        isExhausted: true,
      };

    case "setCouncil":
      return {
        ...sage,
        councilId: action.councilId,
      };

    default:
      return sage;
  }
}

// queries
function isLawfulFull(sage: T) {
  return sage.type === "lawful" && sage.power === MAX_LAWFUL;
}

function isChaosFull(sage: T) {
  return sage.type === "chaos" && sage.power === MAX_CHAOS;
}

export const query = {
  isLawfulFull,
  isChaosFull,
};

// constructor
export function createInitialState(): T {
  return {
    type: "none",
    power: 0,
    isExhausted: false,
    councilId: "",
  };
}
