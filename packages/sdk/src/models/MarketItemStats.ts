import type { MarketStatsInfo } from "./MarketStatsInfo";

export interface MarketItemStats {
  Name?: string;
  TradeRemainCount?: number;
  BundleCount?: number;
  Stats?: Array<MarketStatsInfo>;
  ToolTip?: string;
}
