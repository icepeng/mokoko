import type { SkillRune } from "./SkillRune";
import type { SkillTripod } from "./SkillTripod";

export interface ArmorySkill {
  Name?: string;
  Icon?: string;
  Level?: number;
  Type?: string;
  IsAwakening?: boolean;
  Tripods?: Array<SkillTripod>;
  Rune?: SkillRune;
  Tooltip?: string;
}
