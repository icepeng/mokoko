import type { MarketItem } from "./MarketItem";

export interface MarketList {
  PageNo?: number;
  PageSize?: number;
  TotalCount?: number;
  Items?: Array<MarketItem>;
}
