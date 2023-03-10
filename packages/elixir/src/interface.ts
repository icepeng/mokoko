export interface EffectState {
  name: string;
  value: number;
  isLocked: boolean;
}

export interface Mutation {
  target:
    | "prob"
    | "luckyRatio"
    | "enchantIncreaseAmount"
    | "enchantEffectCount";
  index: number;
  value: number;
  remainTurn: number;
}

export type SageType = "none" | "lawful" | "chaos";

export interface SageState {
  type: SageType;
  power: number;
  isExhausted: boolean;
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
  mutations: Mutation[];
  sages: SageState[];
}

export interface UiState {
  selectedSageIndex: number | null;
  selectedEffectIndex: number | null;
}
