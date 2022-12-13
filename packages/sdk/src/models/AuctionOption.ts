import type { Category } from "./Category";
import type { EtcOption } from "./EtcOption";
import type { SkillOption } from "./SkillOption";

export interface AuctionOption {
  MaxItemLevel?: number;
  ItemGradeQualities?: Array<number>;
  SkillOptions?: Array<SkillOption>;
  EtcOptions?: Array<EtcOption>;
  Categories?: Array<Category>;
  ItemGrades?: Array<string>;
  ItemTiers?: Array<number>;
  Classes?: Array<string>;
}
