export interface RequestMarketItems {
  Sort?: "GRADE" | "YDAY_AVG_PRICE" | "RECENT_PRICE" | "CURRENT_MIN_PRICE";
  CategoryCode?: number;
  CharacterClass?: string;
  ItemTier?: number;
  ItemGrade?: string;
  ItemName?: string;
  PageNo?: number;
  SortCondition?: "ASC" | "DESC";
}
