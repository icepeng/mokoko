// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace ArmoriesTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
  String: string;
  /** The `Boolean` scalar type represents `true` or `false`. */
  Boolean: boolean;
  /** The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. */
  Int: number;
  Float: number;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: bigint;
  ObjMap: any;
};

export type Query = {
  /** Returns a summary of the basic stats by a character name. */
  Armories_GetProfileInfo?: Maybe<ArmoryProfile>;
  /** Returns a summary of the items equipped by a character name. */
  Armories_GetEquipment?: Maybe<Array<Maybe<ArmoryEquipment>>>;
  /** Returns a summary of the avatars equipped by a character name. */
  Armories_GetAvatars?: Maybe<Array<Maybe<ArmoryAvatar>>>;
  /** Returns a summary of the combat skills by a character name. */
  Armories_GetSkills?: Maybe<Array<Maybe<ArmorySkill>>>;
  /** Returns a summary of the engravings equipped by a character name. */
  Armories_GetEngrave?: Maybe<ArmoryEngraving>;
  /** Returns a summary of the cards equipped by a character name. */
  Armories_GetCard?: Maybe<ArmoryCard>;
  /** Returns a summary of the gems equipped by a character name. */
  Armories_GetGem?: Maybe<ArmoryGem>;
  /** Returns a summary of the proving grounds by a character name. */
  Armories_GetColosseumInfo?: Maybe<ColosseumInfo>;
  /** Returns a summary of the collectibles by a character name. */
  Armories_GetCollections?: Maybe<Array<Maybe<Collectible>>>;
};


export type QueryArmories_GetProfileInfoArgs = {
  characterName: Scalars['String'];
};


export type QueryArmories_GetEquipmentArgs = {
  characterName: Scalars['String'];
};


export type QueryArmories_GetAvatarsArgs = {
  characterName: Scalars['String'];
};


export type QueryArmories_GetSkillsArgs = {
  characterName: Scalars['String'];
};


export type QueryArmories_GetEngraveArgs = {
  characterName: Scalars['String'];
};


export type QueryArmories_GetCardArgs = {
  characterName: Scalars['String'];
};


export type QueryArmories_GetGemArgs = {
  characterName: Scalars['String'];
};


export type QueryArmories_GetColosseumInfoArgs = {
  characterName: Scalars['String'];
};


export type QueryArmories_GetCollectionsArgs = {
  characterName: Scalars['String'];
};

export type ArmoryProfile = {
  CharacterImage?: Maybe<Scalars['String']>;
  ExpeditionLevel?: Maybe<Scalars['Int']>;
  PvpGradeName?: Maybe<Scalars['String']>;
  TownLevel?: Maybe<Scalars['Int']>;
  TownName?: Maybe<Scalars['String']>;
  Title?: Maybe<Scalars['String']>;
  GuildMemberGrade?: Maybe<Scalars['String']>;
  GuildName?: Maybe<Scalars['String']>;
  Stats?: Maybe<Array<Maybe<Stat>>>;
  Tendencies?: Maybe<Array<Maybe<Tendency>>>;
  ServerName?: Maybe<Scalars['String']>;
  CharacterName?: Maybe<Scalars['String']>;
  CharacterLevel?: Maybe<Scalars['Int']>;
  CharacterClassName?: Maybe<Scalars['String']>;
  ItemAvgLevel?: Maybe<Scalars['String']>;
  ItemMaxLevel?: Maybe<Scalars['String']>;
};

export type Stat = {
  Type?: Maybe<Scalars['String']>;
  Value?: Maybe<Scalars['String']>;
  Tooltip?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Tendency = {
  Type?: Maybe<Scalars['String']>;
  Point?: Maybe<Scalars['Int']>;
  MaxPoint?: Maybe<Scalars['Int']>;
};

export type ArmoryEquipment = {
  Type?: Maybe<Scalars['String']>;
  Name?: Maybe<Scalars['String']>;
  Icon?: Maybe<Scalars['String']>;
  Grade?: Maybe<Scalars['String']>;
  Tooltip?: Maybe<Scalars['String']>;
};

export type ArmoryAvatar = {
  Type?: Maybe<Scalars['String']>;
  Name?: Maybe<Scalars['String']>;
  Icon?: Maybe<Scalars['String']>;
  Grade?: Maybe<Scalars['String']>;
  IsSet?: Maybe<Scalars['Boolean']>;
  IsInner?: Maybe<Scalars['Boolean']>;
  Tooltip?: Maybe<Scalars['String']>;
};

export type ArmorySkill = {
  Name?: Maybe<Scalars['String']>;
  Icon?: Maybe<Scalars['String']>;
  Level?: Maybe<Scalars['Int']>;
  Type?: Maybe<Scalars['String']>;
  IsAwakening?: Maybe<Scalars['Boolean']>;
  Tripods?: Maybe<Array<Maybe<SkillTripod>>>;
  Rune?: Maybe<SkillRune>;
  Tooltip?: Maybe<Scalars['String']>;
};

export type SkillTripod = {
  Tier?: Maybe<Scalars['Int']>;
  Slot?: Maybe<Scalars['Int']>;
  Name?: Maybe<Scalars['String']>;
  Icon?: Maybe<Scalars['String']>;
  Level?: Maybe<Scalars['Int']>;
  IsSelected?: Maybe<Scalars['Boolean']>;
  Tooltip?: Maybe<Scalars['String']>;
};

export type SkillRune = {
  Name?: Maybe<Scalars['String']>;
  Icon?: Maybe<Scalars['String']>;
  Grade?: Maybe<Scalars['String']>;
  Tooltip?: Maybe<Scalars['String']>;
};

export type ArmoryEngraving = {
  Engravings?: Maybe<Array<Maybe<Engraving>>>;
  Effects?: Maybe<Array<Maybe<Effect>>>;
};

export type Engraving = {
  Slot?: Maybe<Scalars['Int']>;
  Name?: Maybe<Scalars['String']>;
  Icon?: Maybe<Scalars['String']>;
  Tooltip?: Maybe<Scalars['String']>;
};

export type Effect = {
  Name?: Maybe<Scalars['String']>;
  Description?: Maybe<Scalars['String']>;
};

export type ArmoryCard = {
  Cards?: Maybe<Array<Maybe<Card>>>;
  Effects?: Maybe<Array<Maybe<CardEffect>>>;
};

export type Card = {
  Slot?: Maybe<Scalars['Int']>;
  Name?: Maybe<Scalars['String']>;
  Icon?: Maybe<Scalars['String']>;
  AwakeCount?: Maybe<Scalars['Int']>;
  AwakeTotal?: Maybe<Scalars['Int']>;
  Grade?: Maybe<Scalars['String']>;
  Tooltip?: Maybe<Scalars['String']>;
};

export type CardEffect = {
  Index?: Maybe<Scalars['Int']>;
  CardSlots?: Maybe<Array<Maybe<Scalars['Int']>>>;
  Items?: Maybe<Array<Maybe<Effect>>>;
};

export type ArmoryGem = {
  Gems?: Maybe<Array<Maybe<Gem>>>;
  Effects?: Maybe<Array<Maybe<GemEffect>>>;
};

export type Gem = {
  Slot?: Maybe<Scalars['Int']>;
  Name?: Maybe<Scalars['String']>;
  Icon?: Maybe<Scalars['String']>;
  Level?: Maybe<Scalars['Int']>;
  Grade?: Maybe<Scalars['String']>;
  Tooltip?: Maybe<Scalars['String']>;
};

export type GemEffect = {
  GemSlot?: Maybe<Scalars['Int']>;
  Name?: Maybe<Scalars['String']>;
  Description?: Maybe<Scalars['String']>;
  Icon?: Maybe<Scalars['String']>;
  Tooltip?: Maybe<Scalars['String']>;
};

export type ColosseumInfo = {
  Rank?: Maybe<Scalars['Int']>;
  PreRank?: Maybe<Scalars['Int']>;
  Exp?: Maybe<Scalars['BigInt']>;
  Colosseums?: Maybe<Array<Maybe<Colosseum>>>;
};

export type Colosseum = {
  SeasonName?: Maybe<Scalars['String']>;
  Competitive?: Maybe<AggregationTeamDeathMatchRank>;
  TeamDeathmatch?: Maybe<Aggregation>;
  Deathmatch?: Maybe<Aggregation>;
  TeamElimination?: Maybe<AggregationElimination>;
  CoOpBattle?: Maybe<Aggregation>;
};

export type AggregationTeamDeathMatchRank = {
  Rank?: Maybe<Scalars['Int']>;
  RankName?: Maybe<Scalars['String']>;
  RankIcon?: Maybe<Scalars['String']>;
  RankLastMmr?: Maybe<Scalars['Int']>;
  PlayCount?: Maybe<Scalars['Int']>;
  VictoryCount?: Maybe<Scalars['Int']>;
  LoseCount?: Maybe<Scalars['Int']>;
  TieCount?: Maybe<Scalars['Int']>;
  KillCount?: Maybe<Scalars['Int']>;
  AceCount?: Maybe<Scalars['Int']>;
  DeathCount?: Maybe<Scalars['Int']>;
};

export type Aggregation = {
  PlayCount?: Maybe<Scalars['Int']>;
  VictoryCount?: Maybe<Scalars['Int']>;
  LoseCount?: Maybe<Scalars['Int']>;
  TieCount?: Maybe<Scalars['Int']>;
  KillCount?: Maybe<Scalars['Int']>;
  AceCount?: Maybe<Scalars['Int']>;
  DeathCount?: Maybe<Scalars['Int']>;
};

export type AggregationElimination = {
  FirstWinCount?: Maybe<Scalars['Int']>;
  SecondWinCount?: Maybe<Scalars['Int']>;
  ThirdWinCount?: Maybe<Scalars['Int']>;
  FirstPlayCount?: Maybe<Scalars['Int']>;
  SecondPlayCount?: Maybe<Scalars['Int']>;
  ThirdPlayCount?: Maybe<Scalars['Int']>;
  AllKillCount?: Maybe<Scalars['Int']>;
  PlayCount?: Maybe<Scalars['Int']>;
  VictoryCount?: Maybe<Scalars['Int']>;
  LoseCount?: Maybe<Scalars['Int']>;
  TieCount?: Maybe<Scalars['Int']>;
  KillCount?: Maybe<Scalars['Int']>;
  AceCount?: Maybe<Scalars['Int']>;
  DeathCount?: Maybe<Scalars['Int']>;
};

export type Collectible = {
  Type?: Maybe<Scalars['String']>;
  Icon?: Maybe<Scalars['String']>;
  Point?: Maybe<Scalars['Int']>;
  MaxPoint?: Maybe<Scalars['Int']>;
  CollectiblePoints?: Maybe<Array<Maybe<CollectiblePoint>>>;
};

export type CollectiblePoint = {
  PointName?: Maybe<Scalars['String']>;
  Point?: Maybe<Scalars['Int']>;
  MaxPoint?: Maybe<Scalars['Int']>;
};

export type HTTPMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH';

  export type QuerySdk = {
      /** Returns a summary of the basic stats by a character name. **/
  Armories_GetProfileInfo: InContextSdkMethod<Query['Armories_GetProfileInfo'], QueryArmories_GetProfileInfoArgs, MeshContext>,
  /** Returns a summary of the items equipped by a character name. **/
  Armories_GetEquipment: InContextSdkMethod<Query['Armories_GetEquipment'], QueryArmories_GetEquipmentArgs, MeshContext>,
  /** Returns a summary of the avatars equipped by a character name. **/
  Armories_GetAvatars: InContextSdkMethod<Query['Armories_GetAvatars'], QueryArmories_GetAvatarsArgs, MeshContext>,
  /** Returns a summary of the combat skills by a character name. **/
  Armories_GetSkills: InContextSdkMethod<Query['Armories_GetSkills'], QueryArmories_GetSkillsArgs, MeshContext>,
  /** Returns a summary of the engravings equipped by a character name. **/
  Armories_GetEngrave: InContextSdkMethod<Query['Armories_GetEngrave'], QueryArmories_GetEngraveArgs, MeshContext>,
  /** Returns a summary of the cards equipped by a character name. **/
  Armories_GetCard: InContextSdkMethod<Query['Armories_GetCard'], QueryArmories_GetCardArgs, MeshContext>,
  /** Returns a summary of the gems equipped by a character name. **/
  Armories_GetGem: InContextSdkMethod<Query['Armories_GetGem'], QueryArmories_GetGemArgs, MeshContext>,
  /** Returns a summary of the proving grounds by a character name. **/
  Armories_GetColosseumInfo: InContextSdkMethod<Query['Armories_GetColosseumInfo'], QueryArmories_GetColosseumInfoArgs, MeshContext>,
  /** Returns a summary of the collectibles by a character name. **/
  Armories_GetCollections: InContextSdkMethod<Query['Armories_GetCollections'], QueryArmories_GetCollectionsArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["Armories"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
