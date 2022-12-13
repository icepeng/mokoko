import type { Gem } from "./Gem";
import type { GemEffect } from "./GemEffect";

export interface ArmoryGem {
  Gems?: Array<Gem>;
  Effects?: Array<GemEffect>;
}
