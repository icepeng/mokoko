import type { Effect } from "./Effect";

export interface CardEffect {
  Index?: number;
  CardSlots?: Array<number>;
  Items?: Array<Effect>;
}
