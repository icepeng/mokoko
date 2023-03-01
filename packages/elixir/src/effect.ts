import { EffectState, GameState } from "./interface";

export function isEffectMutable(effect: EffectState, maxEnchant: number) {
  return effect.isLocked === false && effect.value < maxEnchant;
}

export const effectLevelTable = {
  0: 0,
  1: 0,
  2: 0,
  3: 1,
  4: 1,
  5: 1,
  6: 2,
  7: 2,
  8: 3,
  9: 4,
  10: 5,
};

export function getEffectLevel(value: number) {
  if (value < 0 || value > 10) {
    throw new Error(`Invalid effect value: ${value}`);
  }

  return effectLevelTable[value as keyof typeof effectLevelTable];
}

export function queryEffectsProb(state: GameState) {
  const mutableCount = state.effects.filter((eff) =>
    isEffectMutable(eff, state.config.maxEnchant)
  ).length;

  const pickRates = Array.from({ length: 5 }, (_, i) =>
    isEffectMutable(state.effects[i], state.config.maxEnchant)
      ? 1 / mutableCount
      : 0
  );

  for (const mutation of state.effectProbMutations) {
    const targetProb = pickRates[mutation.index];
    const updatedProb = Math.max(Math.min(targetProb + mutation.diff, 1), 0);
    const actualDiff = updatedProb - targetProb;

    for (let i = 0; i < 5; i += 1) {
      if (i === mutation.index) {
        pickRates[i] = updatedProb;
      } else {
        pickRates[i] = pickRates[i] * (1 - actualDiff / (1 - targetProb));
      }
    }
  }

  return pickRates;
}
