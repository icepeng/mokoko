import { EffectState } from "./interface";

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
