import type { Effect } from "./Effect";
import type { Engraving } from "./Engraving";

export interface ArmoryEngraving {
  Engravings?: Array<Engraving>;
  Effects?: Array<Effect>;
}
