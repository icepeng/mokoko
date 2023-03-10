import { isEffectMutable } from "./effect";
import { GameState } from "./interface";

export function queryPickRatios(state: GameState) {
  const mutableCount = state.effects.filter((eff) =>
    isEffectMutable(eff, state.config.maxEnchant)
  ).length;

  const pickRatios = Array.from({ length: 5 }, (_, i) =>
    isEffectMutable(state.effects[i], state.config.maxEnchant)
      ? 1 / mutableCount
      : 0
  );

  if (mutableCount === 1) {
    return pickRatios;
  }

  const probMutations = state.mutations.filter(
    (mutation) => mutation.target === "prob"
  );
  for (const mutation of probMutations) {
    if (mutation.target === "prob") {
      const targetProb = pickRatios[mutation.index];
      const updatedProb = Math.max(Math.min(targetProb + mutation.value, 1), 0);
      const actualDiff = updatedProb - targetProb;

      for (let i = 0; i < 5; i += 1) {
        if (i === mutation.index) {
          pickRatios[i] = updatedProb;
        } else {
          pickRatios[i] = pickRatios[i] * (1 - actualDiff / (1 - targetProb));
        }
      }
    }
  }

  return pickRatios;
}

export function queryLuckyRatios(state: GameState) {
  const luckyRatios = Array.from({ length: 5 }, () => 0.1);

  const luckyRatioMutations = state.mutations.filter(
    (mutation) => mutation.target === "luckyRatio"
  );
  for (const mutation of luckyRatioMutations) {
    luckyRatios[mutation.index] = Math.max(
      Math.min(luckyRatios[mutation.index] + mutation.value, 1),
      0
    );
  }

  return luckyRatios;
}

export function queryEnchantEffectCount(state: GameState) {
  return (
    state.mutations.find((mutation) => mutation.target === "enchantEffectCount")
      ?.value ?? 1
  );
}

export function queryEnchantIncreaseAmount(state: GameState) {
  return (
    state.mutations.find(
      (mutation) => mutation.target === "enchantIncreaseAmount"
    )?.value ?? 1
  );
}
