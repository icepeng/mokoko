import type { SearchDetailOption } from "./SearchDetailOption";

export interface RequestAuctionItems {
  ItemLevelMin?: number;
  ItemLevelMax?: number;
  ItemGradeQuality?: number;
  SkillOptions?: Array<SearchDetailOption>;
  EtcOptions?: Array<SearchDetailOption>;
  Sort?:
    | "BIDSTART_PRICE"
    | "BUY_PRICE"
    | "EXPIREDATE"
    | "ITEM_GRADE"
    | "ITEM_LEVEL"
    | "ITEM_QUALITY";
  CategoryCode?: number;
  CharacterClass?: string;
  ItemTier?: number;
  ItemGrade?: string;
  ItemName?: string;
  PageNo?: number;
  SortCondition?: "ASC" | "DESC";
}
