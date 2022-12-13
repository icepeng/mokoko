import type { Card } from "./Card";
import type { CardEffect } from "./CardEffect";

export interface ArmoryCard {
  Cards?: Array<Card>;
  Effects?: Array<CardEffect>;
}
