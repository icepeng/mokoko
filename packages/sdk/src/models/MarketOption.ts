import type { Category } from "./Category";

export interface MarketOption {
  Categories?: Array<Category>;
  ItemGrades?: Array<string>;
  ItemTiers?: Array<number>;
  Classes?: Array<string>;
}
