import type { AuctionItem } from "./AuctionItem";

export interface Auction {
  PageNo?: number;
  PageSize?: number;
  TotalCount?: number;
  Items?: Array<AuctionItem>;
}
