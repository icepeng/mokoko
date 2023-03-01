export interface EffectState {
  name: string;
  value: number;
  luckyRate: number;
  isLocked: boolean;
}

export interface EffectProbMutation {
  index: number;
  diff: number;
}

export type SageType = "none" | "lawful" | "chaos";

export interface SageState {
  type: SageType;
  power: number;
  isRemoved: boolean;
  effectIndex: number | null;
  effectIndex2: number | null;
  councilId: string;
}

export interface GameConfiguration {
  totalTurn: number;
  maxEnchant: number;
}

export interface GameState {
  config: GameConfiguration;
  phase: "option" | "council" | "enchant" | "done";
  turnLeft: number;
  rerollLeft: number;
  effects: EffectState[];
  effectProbMutations: EffectProbMutation[];
  sages: SageState[];
  selectedSageIndex: number;
  enchantIncreaseAmount: number;
  enchantEffectCount: number;
}

export interface Council {
  id: string;
  description: (effectName?: string, effect2Name?: string) => string;
  weight: number;
  condition: (state: GameState, sageIndex: number) => boolean;
  isEffectAvailable?: (effect: EffectState, maxEnchant: number) => boolean;
  onCouncil?: (
    state: GameState,
    sageIndex: number,
    selectedEffectIndex?: number
  ) => GameState;
  onEnchant?: (
    state: GameState,
    sageIndex: number,
    selectedEffectIndex?: number
  ) => GameState;
}
