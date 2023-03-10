import { isEffectMutable } from "./effect";
import { GameState } from "./interface";

export function queryMutationResults(state: GameState) {
  const mutableCount = state.effects.filter((eff) =>
    isEffectMutable(eff, state.config.maxEnchant)
  ).length;

  const pickRatios = Array.from({ length: 5 }, (_, i) =>
    isEffectMutable(state.effects[i], state.config.maxEnchant)
      ? 1 / mutableCount
      : 0
  );
  const luckyRatios = Array.from({ length: 5 }, () => 0.1);
  let enchantEffectCount = 1;
  let enchantIncreaseAmount = 1;

  for (const mutation of state.mutations) {
    if (mutation.target === "prob") {
      const targetProb = pickRatios[mutation.index];
      const updatedProb = Math.max(Math.min(targetProb + mutation.value, 1), 0);
      const actualDiff = updatedProb - targetProb;

      for (let i = 0; i < 5; i += 1) {
        if (i === mutation.index) {
          pickRatios[i] = updatedProb;
        } else {
          if (targetProb === 1) {
            pickRatios[i] = actualDiff;
          } else {
            pickRatios[i] = pickRatios[i] * (1 - actualDiff / (1 - targetProb));
          }
        }
      }
    }
    if (mutation.target === "luckyRatio") {
      luckyRatios[mutation.index] = Math.max(
        Math.min(luckyRatios[mutation.index] + mutation.value, 1),
        0
      );
    }
    if (mutation.target === "enchantEffectCount") {
      enchantEffectCount = mutation.value;
    }
    if (mutation.target === "enchantIncreaseAmount") {
      enchantIncreaseAmount = mutation.value;
    }
  }

  return { pickRatios, luckyRatios, enchantEffectCount, enchantIncreaseAmount };
}
