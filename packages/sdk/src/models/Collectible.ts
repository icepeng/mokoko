import type { CollectiblePoint } from "./CollectiblePoint";

export interface Collectible {
  Type?: string;
  Icon?: string;
  Point?: number;
  MaxPoint?: number;
  CollectiblePoints?: Array<CollectiblePoint>;
}
