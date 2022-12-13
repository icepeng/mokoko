import type { AuctionInfo } from "./AuctionInfo";
import type { ItemOption } from "./ItemOption";

export interface AuctionItem {
  Name?: string;
  Grade?: string;
  Tier?: number;
  Level?: number;
  Icon?: string;
  GradeQuality?: number;
  AuctionInfo?: AuctionInfo;
  Options?: Array<ItemOption>;
}
