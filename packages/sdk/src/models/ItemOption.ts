export interface ItemOption {
  Type?:
    | "None"
    | "SKILL"
    | "STAT"
    | "ABILITY_ENGRAVE"
    | "BRACELET_SPECIAL_EFFECTS"
    | "GEM_SKILL_COOLDOWN_REDUCTION"
    | "GEM_SKILL_COOLDOWN_REDUCTION_IDENTITY"
    | "GEM_SKILL_DAMAGE"
    | "GEM_SKILL_DAMAGE_IDENTITY"
    | "BRACELET_RANDOM_SLOT";
  OptionName?: string;
  OptionNameTripod?: string;
  Value?: number;
  IsPenalty?: boolean;
  ClassName?: string;
}
