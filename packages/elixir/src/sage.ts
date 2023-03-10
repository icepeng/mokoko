import { MAX_CHAOS, MAX_LAWFUL } from "./const";
import { pickCouncil } from "./council";
import { GameState, SageState } from "./interface";

export function updatePowers(
  sages: SageState[],
  selectedSageIndex: number
): SageState[] {
  const sage = sages[selectedSageIndex];

  if (sage.type === "none") {
    return sages.map((sage, index) => {
      if (index === selectedSageIndex) {
        return { ...sage, type: "lawful", power: 1 };
      }
      return { ...sage, type: "chaos", power: 1 };
    });
  }

  if (sage.type === "lawful") {
    return sages.map((sage, index) => {
      if (index === selectedSageIndex) {
        const type = "lawful";
        const power = sage.power === MAX_LAWFUL ? 1 : sage.power + 1;
        return { ...sage, type, power };
      }

      const type = "chaos";
      const power = sage.power === MAX_CHAOS ? 1 : sage.power + 1;
      return { ...sage, type, power };
    });
  }

  if (sage.type === "chaos") {
    return sages.map((sage, index) => {
      if (index === selectedSageIndex) {
        const type = "lawful";
        const power = 1;
        return { ...sage, type, power };
      }
      if (sage.type === "lawful") {
        const type = "chaos";
        const power = 1;
        return { ...sage, type, power };
      }

      const type = "chaos";
      const power = sage.power === MAX_CHAOS ? 1 : sage.power + 1;
      return { ...sage, type, power };
    });
  }

  throw new Error("Invalid sage type");
}

export function updateCouncils(state: GameState): GameState {
  const council1 = pickCouncil(state, 0, []);
  const council2 = pickCouncil(state, 1, [council1]);
  const council3 = pickCouncil(state, 2, [council1, council2]);
  return {
    ...state,
    sages: [
      {
        ...state.sages[0],
        councilId: council1,
      },
      {
        ...state.sages[1],
        councilId: council2,
      },
      {
        ...state.sages[2],
        councilId: council3,
      },
    ],
  };
}
