import type { Aggregation } from "./Aggregation";
import type { AggregationElimination } from "./AggregationElimination";
import type { AggregationTeamDeathMatchRank } from "./AggregationTeamDeathMatchRank";

export interface Colosseum {
  SeasonName?: string;
  Competitive?: AggregationTeamDeathMatchRank;
  TeamDeathmatch?: Aggregation;
  Deathmatch?: Aggregation;
  TeamElimination?: AggregationElimination;
  CoOpBattle?: Aggregation;
}
