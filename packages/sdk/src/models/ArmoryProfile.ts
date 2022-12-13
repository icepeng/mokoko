import type { Stat } from "./Stat";
import type { Tendency } from "./Tendency";

export interface ArmoryProfile {
  CharacterImage?: string;
  ExpeditionLevel?: number;
  PvpGradeName?: string;
  TownLevel?: number;
  TownName?: string;
  Title?: string;
  GuildMemberGrade?: string;
  GuildName?: string;
  Stats?: Array<Stat>;
  Tendencies?: Array<Tendency>;
  ServerName?: string;
  CharacterName?: string;
  CharacterLevel?: number;
  CharacterClassName?: string;
  ItemAvgLevel?: string;
  ItemMaxLevel?: string;
}
