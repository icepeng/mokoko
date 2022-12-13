import type { Tripod } from "./Tripod";

export interface SkillOption {
  Value?: number;
  Class?: string;
  Text?: string;
  IsSkillGroup?: boolean;
  Tripods?: Array<Tripod>;
}
