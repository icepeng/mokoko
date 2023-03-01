import { MAX_CHAOS, MAX_LAWFUL } from "./const";
import { getCouncilById, pickCouncil } from "./council";
import { GameState, SageState } from "./interface";
import chance from "./rng";

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
  return {
    ...state,
    sages: state.sages.map((sage, index) => {
      const councilId = pickCouncil(state, index);
      const council = getCouncilById(councilId);

      if (council.isEffectAvailable) {
        const availableEffects = [0, 1, 2, 3, 4].filter((index) =>
          council.isEffectAvailable!(
            state.effects[index],
            state.config.maxEnchant
          )
        );

        // TODO: 조언 * 옵션 중복이 발생하지 않도록 처리
        const [effectIndex, effectIndex2] = chance.pickset(availableEffects, 2);
        return { ...sage, councilId, effectIndex, effectIndex2 };
      }

      return {
        ...sage,
        councilId,
      };
    }),
  };
}

export function getCouncilDescription(
  state: GameState,
  sageIndex: number
): string {
  const sage = state.sages[sageIndex];
  const council = getCouncilById(sage.councilId);
  const effect =
    sage.effectIndex == null ? null : state.effects[sage.effectIndex];
  const effect2 =
    sage.effectIndex2 == null ? null : state.effects[sage.effectIndex2];

  return council.description(effect?.name, effect2?.name);
}
