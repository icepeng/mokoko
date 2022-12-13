import type { CategoryItem } from "./CategoryItem";

export interface Category {
  Subs?: Array<CategoryItem>;
  Code?: number;
  CodeName?: string;
}
