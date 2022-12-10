// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@graphql-mesh/utils';

import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import OpenapiHandler from "@graphql-mesh/openapi"
import StitchingMerger from "@graphql-mesh/merger-stitching";
import { printWithCache } from '@graphql-mesh/utils';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { GuildsTypes } from './sources/Guilds/types';
import type { MarketsTypes } from './sources/Markets/types';
import type { AuctionsTypes } from './sources/Auctions/types';
import type { CharactersTypes } from './sources/Characters/types';
import type { NewsTypes } from './sources/News/types';
import type { ArmoriesTypes } from './sources/Armories/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
  String: string;
  /** The `Boolean` scalar type represents `true` or `false`. */
  Boolean: boolean;
  /** The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. */
  Int: number;
  /** The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
  Float: number;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: bigint;
  ObjMap: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: Date | string;
};

export type Query = {
  /** Returns search options for the market. */
  Markets_GetOptions?: Maybe<MarketOption>;
  /** Returns a market item by ID. */
  Markets_GetStats?: Maybe<Array<Maybe<MarketItemStats>>>;
  /** Returns a list of events on progress. */
  News_GetEvent?: Maybe<Array<Maybe<Event>>>;
  /** Returns a list of guild rankings by a server. */
  Guilds_GetGuild?: Maybe<Array<Maybe<GuildRanking>>>;
  /** Returns search options for the auction house. */
  Auctions_GetOptions?: Maybe<AuctionOption>;
  /** Returns all active auctions with search options. */
  Auctions_GetItems?: Maybe<Auction>;
  /** Returns all character profiles for an account. */
  Characters_GetCharacters?: Maybe<Array<Maybe<CharacterInfo>>>;
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


export type QueryMarkets_GetStatsArgs = {
  itemId: Scalars['BigInt'];
};


export type QueryGuilds_GetGuildArgs = {
  serverName: queryInput_Guilds_GetGuild_serverName;
};


export type QueryAuctions_GetItemsArgs = {
  input: RequestAuctionItems_Input;
};


export type QueryCharacters_GetCharactersArgs = {
  characterName: Scalars['String'];
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

export type Mutation = {
  /** Returns all active market items with search options. */
  Markets_GetItems?: Maybe<MarketList>;
};


export type MutationMarkets_GetItemsArgs = {
  input: RequestMarketItems_Input;
};

export type MarketOption = {
  Categories?: Maybe<Array<Maybe<Category>>>;
  ItemGrades?: Maybe<Array<Maybe<Scalars['String']>>>;
  ItemTiers?: Maybe<Array<Maybe<Scalars['Int']>>>;
  Classes?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Category = {
  Subs?: Maybe<Array<Maybe<CategoryItem>>>;
  Code?: Maybe<Scalars['Int']>;
  CodeName?: Maybe<Scalars['String']>;
};

export type CategoryItem = {
  Code?: Maybe<Scalars['Int']>;
  CodeName?: Maybe<Scalars['String']>;
};

export type MarketItemStats = {
  Name?: Maybe<Scalars['String']>;
  TradeRemainCount?: Maybe<Scalars['Int']>;
  BundleCount?: Maybe<Scalars['Int']>;
  Stats?: Maybe<Array<Maybe<MarketStatsInfo>>>;
};

export type MarketStatsInfo = {
  Date?: Maybe<Scalars['String']>;
  AvgPrice?: Maybe<Scalars['Float']>;
  TradeCount?: Maybe<Scalars['Int']>;
};

export type MarketList = {
  PageNo?: Maybe<Scalars['Int']>;
  PageSize?: Maybe<Scalars['Int']>;
  TotalCount?: Maybe<Scalars['Int']>;
  Items?: Maybe<Array<Maybe<MarketItem>>>;
};

export type MarketItem = {
  Id?: Maybe<Scalars['BigInt']>;
  Name?: Maybe<Scalars['String']>;
  Grade?: Maybe<Scalars['String']>;
  Icon?: Maybe<Scalars['String']>;
  BundleCount?: Maybe<Scalars['Int']>;
  TradeRemainCount?: Maybe<Scalars['Int']>;
  YDayAvgPrice?: Maybe<Scalars['Float']>;
  RecentPrice?: Maybe<Scalars['Int']>;
  CurrentMinPrice?: Maybe<Scalars['Int']>;
};

/** The search options for the market */
export type RequestMarketItems_Input = {
  Sort?: InputMaybe<mutationInput_Markets_GetItems_input_Sort>;
  CategoryCode?: InputMaybe<Scalars['Int']>;
  CharacterClass?: InputMaybe<Scalars['String']>;
  ItemTier?: InputMaybe<Scalars['Int']>;
  ItemGrade?: InputMaybe<Scalars['String']>;
  ItemName?: InputMaybe<Scalars['String']>;
  PageNo?: InputMaybe<Scalars['Int']>;
  SortCondition?: InputMaybe<mutationInput_Markets_GetItems_input_SortCondition>;
};

export type mutationInput_Markets_GetItems_input_Sort =
  | 'GRADE'
  | 'YDAY_AVG_PRICE'
  | 'RECENT_PRICE'
  | 'CURRENT_MIN_PRICE';

export type mutationInput_Markets_GetItems_input_SortCondition =
  | 'ASC'
  | 'DESC';

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

export type Event = {
  Title?: Maybe<Scalars['String']>;
  Thumbnail?: Maybe<Scalars['String']>;
  Link?: Maybe<Scalars['String']>;
  StartDate?: Maybe<Scalars['DateTime']>;
  EndDate?: Maybe<Scalars['DateTime']>;
  RewardDate?: Maybe<Scalars['DateTime']>;
};

export type GuildRanking = {
  Rank?: Maybe<Scalars['Int']>;
  GuildName?: Maybe<Scalars['String']>;
  GuildMessage?: Maybe<Scalars['String']>;
  MasterName?: Maybe<Scalars['String']>;
  Rating?: Maybe<Scalars['Int']>;
  MemberCount?: Maybe<Scalars['Int']>;
  MaxMemberCount?: Maybe<Scalars['Int']>;
  UpdatedDate?: Maybe<Scalars['DateTime']>;
};

/** The name of the server */
export type queryInput_Guilds_GetGuild_serverName =
  | '_47336__54168__50728_'
  | '_49892__47532__50504_'
  | '_50500__47564_'
  | '_52852__47560__51064_'
  | '_52852__51228__47196__49828_'
  | '_50500__48652__47120__49800__46300_'
  | '_52852__45800_'
  | '_45768__45208__48652_';

export type AuctionOption = {
  MaxItemLevel?: Maybe<Scalars['Int']>;
  ItemGradeQualities?: Maybe<Array<Maybe<Scalars['Int']>>>;
  SkillOptions?: Maybe<Array<Maybe<SkillOption>>>;
  EtcOptions?: Maybe<Array<Maybe<EtcOption>>>;
  Categories?: Maybe<Array<Maybe<Category>>>;
  ItemGrades?: Maybe<Array<Maybe<Scalars['String']>>>;
  ItemTiers?: Maybe<Array<Maybe<Scalars['Int']>>>;
  Classes?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type SkillOption = {
  Value?: Maybe<Scalars['Int']>;
  Class?: Maybe<Scalars['String']>;
  Text?: Maybe<Scalars['String']>;
  IsSkillGroup?: Maybe<Scalars['Boolean']>;
  Tripods?: Maybe<Array<Maybe<Tripod>>>;
};

export type Tripod = {
  Value?: Maybe<Scalars['Int']>;
  Text?: Maybe<Scalars['String']>;
  IsGem?: Maybe<Scalars['Boolean']>;
};

export type EtcOption = {
  Value?: Maybe<Scalars['Int']>;
  Text?: Maybe<Scalars['String']>;
  EtcSubs?: Maybe<Array<Maybe<EtcSub>>>;
};

export type EtcSub = {
  Value?: Maybe<Scalars['Int']>;
  Text?: Maybe<Scalars['String']>;
  Class?: Maybe<Scalars['String']>;
};

export type Auction = {
  PageNo?: Maybe<Scalars['Int']>;
  PageSize?: Maybe<Scalars['Int']>;
  TotalCount?: Maybe<Scalars['BigInt']>;
  Items?: Maybe<Array<Maybe<AuctionItem>>>;
};

export type AuctionItem = {
  Name?: Maybe<Scalars['String']>;
  Grade?: Maybe<Scalars['String']>;
  Tier?: Maybe<Scalars['Int']>;
  Level?: Maybe<Scalars['Int']>;
  Icon?: Maybe<Scalars['String']>;
  GradeQuality?: Maybe<Scalars['Int']>;
  AuctionInfo?: Maybe<AuctionInfo>;
  Options?: Maybe<Array<Maybe<ItemOption>>>;
};

export type AuctionInfo = {
  StartPrice?: Maybe<Scalars['BigInt']>;
  BuyPrice?: Maybe<Scalars['BigInt']>;
  BidPrice?: Maybe<Scalars['BigInt']>;
  EndDate?: Maybe<Scalars['DateTime']>;
  BidCount?: Maybe<Scalars['Int']>;
  BidStartPrice?: Maybe<Scalars['BigInt']>;
  IsCompetitive?: Maybe<Scalars['Boolean']>;
  TradeAllowCount?: Maybe<Scalars['Int']>;
};

export type ItemOption = {
  Type?: Maybe<query_Auctions_GetItems_Items_items_Options_items_Type>;
  OptionName?: Maybe<Scalars['String']>;
  OptionNameTripod?: Maybe<Scalars['String']>;
  Value?: Maybe<Scalars['Int']>;
  IsPenalty?: Maybe<Scalars['Boolean']>;
  ClassName?: Maybe<Scalars['String']>;
};

export type query_Auctions_GetItems_Items_items_Options_items_Type =
  | 'None'
  | 'SKILL'
  | 'STAT'
  | 'ABILITY_ENGRAVE'
  | 'BRACELET_SPECIAL_EFFECTS'
  | 'GEM_SKILL_COOLDOWN_REDUCTION'
  | 'GEM_SKILL_COOLDOWN_REDUCTION_IDENTITY'
  | 'GEM_SKILL_DAMAGE'
  | 'GEM_SKILL_DAMAGE_IDENTITY'
  | 'BRACELET_RANDOM_SLOT';

/** The search options for the auction house */
export type RequestAuctionItems_Input = {
  ItemLevelMin?: InputMaybe<Scalars['Int']>;
  ItemLevelMax?: InputMaybe<Scalars['Int']>;
  ItemGradeQuality?: InputMaybe<Scalars['Int']>;
  SkillOptions?: InputMaybe<Array<InputMaybe<SearchDetailOption_Input>>>;
  EtcOptions?: InputMaybe<Array<InputMaybe<SearchDetailOption_Input>>>;
  Sort?: InputMaybe<queryInput_Auctions_GetItems_input_Sort>;
  CategoryCode?: InputMaybe<Scalars['Int']>;
  CharacterClass?: InputMaybe<Scalars['String']>;
  ItemTier?: InputMaybe<Scalars['Int']>;
  ItemGrade?: InputMaybe<Scalars['String']>;
  ItemName?: InputMaybe<Scalars['String']>;
  PageNo?: InputMaybe<Scalars['Int']>;
  SortCondition?: InputMaybe<queryInput_Auctions_GetItems_input_SortCondition>;
};

export type SearchDetailOption_Input = {
  FirstOption?: InputMaybe<Scalars['Int']>;
  SecondOption?: InputMaybe<Scalars['Int']>;
  MinValue?: InputMaybe<Scalars['Int']>;
  MaxValue?: InputMaybe<Scalars['Int']>;
};

export type queryInput_Auctions_GetItems_input_Sort =
  | 'BIDSTART_PRICE'
  | 'BUY_PRICE'
  | 'EXPIREDATE'
  | 'ITEM_GRADE'
  | 'ITEM_LEVEL'
  | 'ITEM_QUALITY';

export type queryInput_Auctions_GetItems_input_SortCondition =
  | 'ASC'
  | 'DESC';

export type CharacterInfo = {
  ServerName?: Maybe<Scalars['String']>;
  CharacterName?: Maybe<Scalars['String']>;
  CharacterLevel?: Maybe<Scalars['Int']>;
  CharacterClassName?: Maybe<Scalars['String']>;
  ItemAvgLevel?: Maybe<Scalars['String']>;
  ItemMaxLevel?: Maybe<Scalars['String']>;
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  MarketOption: ResolverTypeWrapper<MarketOption>;
  Category: ResolverTypeWrapper<Category>;
  CategoryItem: ResolverTypeWrapper<CategoryItem>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  MarketItemStats: ResolverTypeWrapper<MarketItemStats>;
  MarketStatsInfo: ResolverTypeWrapper<MarketStatsInfo>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  MarketList: ResolverTypeWrapper<MarketList>;
  MarketItem: ResolverTypeWrapper<MarketItem>;
  RequestMarketItems_Input: RequestMarketItems_Input;
  mutationInput_Markets_GetItems_input_Sort: mutationInput_Markets_GetItems_input_Sort;
  mutationInput_Markets_GetItems_input_SortCondition: mutationInput_Markets_GetItems_input_SortCondition;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ObjMap: ResolverTypeWrapper<Scalars['ObjMap']>;
  HTTPMethod: HTTPMethod;
  Event: ResolverTypeWrapper<Event>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  GuildRanking: ResolverTypeWrapper<GuildRanking>;
  queryInput_Guilds_GetGuild_serverName: queryInput_Guilds_GetGuild_serverName;
  AuctionOption: ResolverTypeWrapper<AuctionOption>;
  SkillOption: ResolverTypeWrapper<SkillOption>;
  Tripod: ResolverTypeWrapper<Tripod>;
  EtcOption: ResolverTypeWrapper<EtcOption>;
  EtcSub: ResolverTypeWrapper<EtcSub>;
  Auction: ResolverTypeWrapper<Auction>;
  AuctionItem: ResolverTypeWrapper<AuctionItem>;
  AuctionInfo: ResolverTypeWrapper<AuctionInfo>;
  ItemOption: ResolverTypeWrapper<ItemOption>;
  query_Auctions_GetItems_Items_items_Options_items_Type: query_Auctions_GetItems_Items_items_Options_items_Type;
  RequestAuctionItems_Input: RequestAuctionItems_Input;
  SearchDetailOption_Input: SearchDetailOption_Input;
  queryInput_Auctions_GetItems_input_Sort: queryInput_Auctions_GetItems_input_Sort;
  queryInput_Auctions_GetItems_input_SortCondition: queryInput_Auctions_GetItems_input_SortCondition;
  CharacterInfo: ResolverTypeWrapper<CharacterInfo>;
  ArmoryProfile: ResolverTypeWrapper<ArmoryProfile>;
  Stat: ResolverTypeWrapper<Stat>;
  Tendency: ResolverTypeWrapper<Tendency>;
  ArmoryEquipment: ResolverTypeWrapper<ArmoryEquipment>;
  ArmoryAvatar: ResolverTypeWrapper<ArmoryAvatar>;
  ArmorySkill: ResolverTypeWrapper<ArmorySkill>;
  SkillTripod: ResolverTypeWrapper<SkillTripod>;
  SkillRune: ResolverTypeWrapper<SkillRune>;
  ArmoryEngraving: ResolverTypeWrapper<ArmoryEngraving>;
  Engraving: ResolverTypeWrapper<Engraving>;
  Effect: ResolverTypeWrapper<Effect>;
  ArmoryCard: ResolverTypeWrapper<ArmoryCard>;
  Card: ResolverTypeWrapper<Card>;
  CardEffect: ResolverTypeWrapper<CardEffect>;
  ArmoryGem: ResolverTypeWrapper<ArmoryGem>;
  Gem: ResolverTypeWrapper<Gem>;
  GemEffect: ResolverTypeWrapper<GemEffect>;
  ColosseumInfo: ResolverTypeWrapper<ColosseumInfo>;
  Colosseum: ResolverTypeWrapper<Colosseum>;
  AggregationTeamDeathMatchRank: ResolverTypeWrapper<AggregationTeamDeathMatchRank>;
  Aggregation: ResolverTypeWrapper<Aggregation>;
  AggregationElimination: ResolverTypeWrapper<AggregationElimination>;
  Collectible: ResolverTypeWrapper<Collectible>;
  CollectiblePoint: ResolverTypeWrapper<CollectiblePoint>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Mutation: {};
  MarketOption: MarketOption;
  Category: Category;
  CategoryItem: CategoryItem;
  Int: Scalars['Int'];
  String: Scalars['String'];
  MarketItemStats: MarketItemStats;
  MarketStatsInfo: MarketStatsInfo;
  Float: Scalars['Float'];
  BigInt: Scalars['BigInt'];
  MarketList: MarketList;
  MarketItem: MarketItem;
  RequestMarketItems_Input: RequestMarketItems_Input;
  Boolean: Scalars['Boolean'];
  ObjMap: Scalars['ObjMap'];
  Event: Event;
  DateTime: Scalars['DateTime'];
  GuildRanking: GuildRanking;
  AuctionOption: AuctionOption;
  SkillOption: SkillOption;
  Tripod: Tripod;
  EtcOption: EtcOption;
  EtcSub: EtcSub;
  Auction: Auction;
  AuctionItem: AuctionItem;
  AuctionInfo: AuctionInfo;
  ItemOption: ItemOption;
  RequestAuctionItems_Input: RequestAuctionItems_Input;
  SearchDetailOption_Input: SearchDetailOption_Input;
  CharacterInfo: CharacterInfo;
  ArmoryProfile: ArmoryProfile;
  Stat: Stat;
  Tendency: Tendency;
  ArmoryEquipment: ArmoryEquipment;
  ArmoryAvatar: ArmoryAvatar;
  ArmorySkill: ArmorySkill;
  SkillTripod: SkillTripod;
  SkillRune: SkillRune;
  ArmoryEngraving: ArmoryEngraving;
  Engraving: Engraving;
  Effect: Effect;
  ArmoryCard: ArmoryCard;
  Card: Card;
  CardEffect: CardEffect;
  ArmoryGem: ArmoryGem;
  Gem: Gem;
  GemEffect: GemEffect;
  ColosseumInfo: ColosseumInfo;
  Colosseum: Colosseum;
  AggregationTeamDeathMatchRank: AggregationTeamDeathMatchRank;
  Aggregation: Aggregation;
  AggregationElimination: AggregationElimination;
  Collectible: Collectible;
  CollectiblePoint: CollectiblePoint;
}>;

export type enumDirectiveArgs = {
  value?: Maybe<Scalars['String']>;
};

export type enumDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = enumDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type globalOptionsDirectiveArgs = {
  sourceName?: Maybe<Scalars['String']>;
  endpoint?: Maybe<Scalars['String']>;
  operationHeaders?: Maybe<Scalars['ObjMap']>;
  queryStringOptions?: Maybe<Scalars['ObjMap']>;
  queryParams?: Maybe<Scalars['ObjMap']>;
};

export type globalOptionsDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = globalOptionsDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type httpOperationDirectiveArgs = {
  path?: Maybe<Scalars['String']>;
  operationSpecificHeaders?: Maybe<Scalars['ObjMap']>;
  httpMethod?: Maybe<HTTPMethod>;
  isBinary?: Maybe<Scalars['Boolean']>;
  requestBaseBody?: Maybe<Scalars['ObjMap']>;
  queryParamArgMap?: Maybe<Scalars['ObjMap']>;
  queryStringOptionsByParam?: Maybe<Scalars['ObjMap']>;
};

export type httpOperationDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = httpOperationDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  Markets_GetOptions?: Resolver<Maybe<ResolversTypes['MarketOption']>, ParentType, ContextType>;
  Markets_GetStats?: Resolver<Maybe<Array<Maybe<ResolversTypes['MarketItemStats']>>>, ParentType, ContextType, RequireFields<QueryMarkets_GetStatsArgs, 'itemId'>>;
  News_GetEvent?: Resolver<Maybe<Array<Maybe<ResolversTypes['Event']>>>, ParentType, ContextType>;
  Guilds_GetGuild?: Resolver<Maybe<Array<Maybe<ResolversTypes['GuildRanking']>>>, ParentType, ContextType, RequireFields<QueryGuilds_GetGuildArgs, 'serverName'>>;
  Auctions_GetOptions?: Resolver<Maybe<ResolversTypes['AuctionOption']>, ParentType, ContextType>;
  Auctions_GetItems?: Resolver<Maybe<ResolversTypes['Auction']>, ParentType, ContextType, RequireFields<QueryAuctions_GetItemsArgs, 'input'>>;
  Characters_GetCharacters?: Resolver<Maybe<Array<Maybe<ResolversTypes['CharacterInfo']>>>, ParentType, ContextType, RequireFields<QueryCharacters_GetCharactersArgs, 'characterName'>>;
  Armories_GetProfileInfo?: Resolver<Maybe<ResolversTypes['ArmoryProfile']>, ParentType, ContextType, RequireFields<QueryArmories_GetProfileInfoArgs, 'characterName'>>;
  Armories_GetEquipment?: Resolver<Maybe<Array<Maybe<ResolversTypes['ArmoryEquipment']>>>, ParentType, ContextType, RequireFields<QueryArmories_GetEquipmentArgs, 'characterName'>>;
  Armories_GetAvatars?: Resolver<Maybe<Array<Maybe<ResolversTypes['ArmoryAvatar']>>>, ParentType, ContextType, RequireFields<QueryArmories_GetAvatarsArgs, 'characterName'>>;
  Armories_GetSkills?: Resolver<Maybe<Array<Maybe<ResolversTypes['ArmorySkill']>>>, ParentType, ContextType, RequireFields<QueryArmories_GetSkillsArgs, 'characterName'>>;
  Armories_GetEngrave?: Resolver<Maybe<ResolversTypes['ArmoryEngraving']>, ParentType, ContextType, RequireFields<QueryArmories_GetEngraveArgs, 'characterName'>>;
  Armories_GetCard?: Resolver<Maybe<ResolversTypes['ArmoryCard']>, ParentType, ContextType, RequireFields<QueryArmories_GetCardArgs, 'characterName'>>;
  Armories_GetGem?: Resolver<Maybe<ResolversTypes['ArmoryGem']>, ParentType, ContextType, RequireFields<QueryArmories_GetGemArgs, 'characterName'>>;
  Armories_GetColosseumInfo?: Resolver<Maybe<ResolversTypes['ColosseumInfo']>, ParentType, ContextType, RequireFields<QueryArmories_GetColosseumInfoArgs, 'characterName'>>;
  Armories_GetCollections?: Resolver<Maybe<Array<Maybe<ResolversTypes['Collectible']>>>, ParentType, ContextType, RequireFields<QueryArmories_GetCollectionsArgs, 'characterName'>>;
}>;

export type MutationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  Markets_GetItems?: Resolver<Maybe<ResolversTypes['MarketList']>, ParentType, ContextType, RequireFields<MutationMarkets_GetItemsArgs, 'input'>>;
}>;

export type MarketOptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MarketOption'] = ResolversParentTypes['MarketOption']> = ResolversObject<{
  Categories?: Resolver<Maybe<Array<Maybe<ResolversTypes['Category']>>>, ParentType, ContextType>;
  ItemGrades?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  ItemTiers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  Classes?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CategoryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = ResolversObject<{
  Subs?: Resolver<Maybe<Array<Maybe<ResolversTypes['CategoryItem']>>>, ParentType, ContextType>;
  Code?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  CodeName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CategoryItemResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CategoryItem'] = ResolversParentTypes['CategoryItem']> = ResolversObject<{
  Code?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  CodeName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarketItemStatsResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MarketItemStats'] = ResolversParentTypes['MarketItemStats']> = ResolversObject<{
  Name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  TradeRemainCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  BundleCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Stats?: Resolver<Maybe<Array<Maybe<ResolversTypes['MarketStatsInfo']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarketStatsInfoResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MarketStatsInfo'] = ResolversParentTypes['MarketStatsInfo']> = ResolversObject<{
  Date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  AvgPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  TradeCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type MarketListResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MarketList'] = ResolversParentTypes['MarketList']> = ResolversObject<{
  PageNo?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  PageSize?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  TotalCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Items?: Resolver<Maybe<Array<Maybe<ResolversTypes['MarketItem']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarketItemResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MarketItem'] = ResolversParentTypes['MarketItem']> = ResolversObject<{
  Id?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  Name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Grade?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  BundleCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  TradeRemainCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  YDayAvgPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  RecentPrice?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  CurrentMinPrice?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface ObjMapScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjMap'], any> {
  name: 'ObjMap';
}

export type EventResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = ResolversObject<{
  Title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  StartDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  EndDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  RewardDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type GuildRankingResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['GuildRanking'] = ResolversParentTypes['GuildRanking']> = ResolversObject<{
  Rank?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  GuildName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  GuildMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  MasterName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Rating?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  MemberCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  MaxMemberCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  UpdatedDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuctionOptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['AuctionOption'] = ResolversParentTypes['AuctionOption']> = ResolversObject<{
  MaxItemLevel?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ItemGradeQualities?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  SkillOptions?: Resolver<Maybe<Array<Maybe<ResolversTypes['SkillOption']>>>, ParentType, ContextType>;
  EtcOptions?: Resolver<Maybe<Array<Maybe<ResolversTypes['EtcOption']>>>, ParentType, ContextType>;
  Categories?: Resolver<Maybe<Array<Maybe<ResolversTypes['Category']>>>, ParentType, ContextType>;
  ItemGrades?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  ItemTiers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  Classes?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkillOptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['SkillOption'] = ResolversParentTypes['SkillOption']> = ResolversObject<{
  Value?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Class?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  IsSkillGroup?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  Tripods?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tripod']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TripodResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Tripod'] = ResolversParentTypes['Tripod']> = ResolversObject<{
  Value?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  IsGem?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EtcOptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['EtcOption'] = ResolversParentTypes['EtcOption']> = ResolversObject<{
  Value?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  EtcSubs?: Resolver<Maybe<Array<Maybe<ResolversTypes['EtcSub']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EtcSubResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['EtcSub'] = ResolversParentTypes['EtcSub']> = ResolversObject<{
  Value?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Class?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuctionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Auction'] = ResolversParentTypes['Auction']> = ResolversObject<{
  PageNo?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  PageSize?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  TotalCount?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  Items?: Resolver<Maybe<Array<Maybe<ResolversTypes['AuctionItem']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuctionItemResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['AuctionItem'] = ResolversParentTypes['AuctionItem']> = ResolversObject<{
  Name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Grade?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Tier?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Level?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  GradeQuality?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  AuctionInfo?: Resolver<Maybe<ResolversTypes['AuctionInfo']>, ParentType, ContextType>;
  Options?: Resolver<Maybe<Array<Maybe<ResolversTypes['ItemOption']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuctionInfoResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['AuctionInfo'] = ResolversParentTypes['AuctionInfo']> = ResolversObject<{
  StartPrice?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  BuyPrice?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  BidPrice?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  EndDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  BidCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  BidStartPrice?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  IsCompetitive?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  TradeAllowCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ItemOptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ItemOption'] = ResolversParentTypes['ItemOption']> = ResolversObject<{
  Type?: Resolver<Maybe<ResolversTypes['query_Auctions_GetItems_Items_items_Options_items_Type']>, ParentType, ContextType>;
  OptionName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  OptionNameTripod?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Value?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  IsPenalty?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  ClassName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CharacterInfoResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CharacterInfo'] = ResolversParentTypes['CharacterInfo']> = ResolversObject<{
  ServerName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  CharacterName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  CharacterLevel?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  CharacterClassName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ItemAvgLevel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ItemMaxLevel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArmoryProfileResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ArmoryProfile'] = ResolversParentTypes['ArmoryProfile']> = ResolversObject<{
  CharacterImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ExpeditionLevel?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  PvpGradeName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  TownLevel?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  TownName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  GuildMemberGrade?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  GuildName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Stats?: Resolver<Maybe<Array<Maybe<ResolversTypes['Stat']>>>, ParentType, ContextType>;
  Tendencies?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tendency']>>>, ParentType, ContextType>;
  ServerName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  CharacterName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  CharacterLevel?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  CharacterClassName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ItemAvgLevel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ItemMaxLevel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StatResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Stat'] = ResolversParentTypes['Stat']> = ResolversObject<{
  Type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Tooltip?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TendencyResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Tendency'] = ResolversParentTypes['Tendency']> = ResolversObject<{
  Type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Point?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  MaxPoint?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArmoryEquipmentResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ArmoryEquipment'] = ResolversParentTypes['ArmoryEquipment']> = ResolversObject<{
  Type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Grade?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Tooltip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArmoryAvatarResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ArmoryAvatar'] = ResolversParentTypes['ArmoryAvatar']> = ResolversObject<{
  Type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Grade?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  IsSet?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  IsInner?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  Tooltip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArmorySkillResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ArmorySkill'] = ResolversParentTypes['ArmorySkill']> = ResolversObject<{
  Name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Level?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  IsAwakening?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  Tripods?: Resolver<Maybe<Array<Maybe<ResolversTypes['SkillTripod']>>>, ParentType, ContextType>;
  Rune?: Resolver<Maybe<ResolversTypes['SkillRune']>, ParentType, ContextType>;
  Tooltip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkillTripodResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['SkillTripod'] = ResolversParentTypes['SkillTripod']> = ResolversObject<{
  Tier?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Slot?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Level?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  IsSelected?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  Tooltip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkillRuneResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['SkillRune'] = ResolversParentTypes['SkillRune']> = ResolversObject<{
  Name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Grade?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Tooltip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArmoryEngravingResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ArmoryEngraving'] = ResolversParentTypes['ArmoryEngraving']> = ResolversObject<{
  Engravings?: Resolver<Maybe<Array<Maybe<ResolversTypes['Engraving']>>>, ParentType, ContextType>;
  Effects?: Resolver<Maybe<Array<Maybe<ResolversTypes['Effect']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EngravingResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Engraving'] = ResolversParentTypes['Engraving']> = ResolversObject<{
  Slot?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Tooltip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EffectResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Effect'] = ResolversParentTypes['Effect']> = ResolversObject<{
  Name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArmoryCardResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ArmoryCard'] = ResolversParentTypes['ArmoryCard']> = ResolversObject<{
  Cards?: Resolver<Maybe<Array<Maybe<ResolversTypes['Card']>>>, ParentType, ContextType>;
  Effects?: Resolver<Maybe<Array<Maybe<ResolversTypes['CardEffect']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CardResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Card'] = ResolversParentTypes['Card']> = ResolversObject<{
  Slot?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  AwakeCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  AwakeTotal?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Grade?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Tooltip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CardEffectResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CardEffect'] = ResolversParentTypes['CardEffect']> = ResolversObject<{
  Index?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  CardSlots?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  Items?: Resolver<Maybe<Array<Maybe<ResolversTypes['Effect']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArmoryGemResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ArmoryGem'] = ResolversParentTypes['ArmoryGem']> = ResolversObject<{
  Gems?: Resolver<Maybe<Array<Maybe<ResolversTypes['Gem']>>>, ParentType, ContextType>;
  Effects?: Resolver<Maybe<Array<Maybe<ResolversTypes['GemEffect']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GemResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Gem'] = ResolversParentTypes['Gem']> = ResolversObject<{
  Slot?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Level?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Grade?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Tooltip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GemEffectResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['GemEffect'] = ResolversParentTypes['GemEffect']> = ResolversObject<{
  GemSlot?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Tooltip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ColosseumInfoResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ColosseumInfo'] = ResolversParentTypes['ColosseumInfo']> = ResolversObject<{
  Rank?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  PreRank?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Exp?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  Colosseums?: Resolver<Maybe<Array<Maybe<ResolversTypes['Colosseum']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ColosseumResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Colosseum'] = ResolversParentTypes['Colosseum']> = ResolversObject<{
  SeasonName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Competitive?: Resolver<Maybe<ResolversTypes['AggregationTeamDeathMatchRank']>, ParentType, ContextType>;
  TeamDeathmatch?: Resolver<Maybe<ResolversTypes['Aggregation']>, ParentType, ContextType>;
  Deathmatch?: Resolver<Maybe<ResolversTypes['Aggregation']>, ParentType, ContextType>;
  TeamElimination?: Resolver<Maybe<ResolversTypes['AggregationElimination']>, ParentType, ContextType>;
  CoOpBattle?: Resolver<Maybe<ResolversTypes['Aggregation']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AggregationTeamDeathMatchRankResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['AggregationTeamDeathMatchRank'] = ResolversParentTypes['AggregationTeamDeathMatchRank']> = ResolversObject<{
  Rank?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  RankName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  RankIcon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  RankLastMmr?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  PlayCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  VictoryCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  LoseCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  TieCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  KillCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  AceCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  DeathCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AggregationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Aggregation'] = ResolversParentTypes['Aggregation']> = ResolversObject<{
  PlayCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  VictoryCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  LoseCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  TieCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  KillCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  AceCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  DeathCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AggregationEliminationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['AggregationElimination'] = ResolversParentTypes['AggregationElimination']> = ResolversObject<{
  FirstWinCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  SecondWinCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ThirdWinCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  FirstPlayCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  SecondPlayCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ThirdPlayCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  AllKillCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  PlayCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  VictoryCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  LoseCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  TieCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  KillCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  AceCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  DeathCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CollectibleResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Collectible'] = ResolversParentTypes['Collectible']> = ResolversObject<{
  Type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Point?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  MaxPoint?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  CollectiblePoints?: Resolver<Maybe<Array<Maybe<ResolversTypes['CollectiblePoint']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CollectiblePointResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CollectiblePoint'] = ResolversParentTypes['CollectiblePoint']> = ResolversObject<{
  PointName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Point?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  MaxPoint?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MarketOption?: MarketOptionResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  CategoryItem?: CategoryItemResolvers<ContextType>;
  MarketItemStats?: MarketItemStatsResolvers<ContextType>;
  MarketStatsInfo?: MarketStatsInfoResolvers<ContextType>;
  BigInt?: GraphQLScalarType;
  MarketList?: MarketListResolvers<ContextType>;
  MarketItem?: MarketItemResolvers<ContextType>;
  ObjMap?: GraphQLScalarType;
  Event?: EventResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  GuildRanking?: GuildRankingResolvers<ContextType>;
  AuctionOption?: AuctionOptionResolvers<ContextType>;
  SkillOption?: SkillOptionResolvers<ContextType>;
  Tripod?: TripodResolvers<ContextType>;
  EtcOption?: EtcOptionResolvers<ContextType>;
  EtcSub?: EtcSubResolvers<ContextType>;
  Auction?: AuctionResolvers<ContextType>;
  AuctionItem?: AuctionItemResolvers<ContextType>;
  AuctionInfo?: AuctionInfoResolvers<ContextType>;
  ItemOption?: ItemOptionResolvers<ContextType>;
  CharacterInfo?: CharacterInfoResolvers<ContextType>;
  ArmoryProfile?: ArmoryProfileResolvers<ContextType>;
  Stat?: StatResolvers<ContextType>;
  Tendency?: TendencyResolvers<ContextType>;
  ArmoryEquipment?: ArmoryEquipmentResolvers<ContextType>;
  ArmoryAvatar?: ArmoryAvatarResolvers<ContextType>;
  ArmorySkill?: ArmorySkillResolvers<ContextType>;
  SkillTripod?: SkillTripodResolvers<ContextType>;
  SkillRune?: SkillRuneResolvers<ContextType>;
  ArmoryEngraving?: ArmoryEngravingResolvers<ContextType>;
  Engraving?: EngravingResolvers<ContextType>;
  Effect?: EffectResolvers<ContextType>;
  ArmoryCard?: ArmoryCardResolvers<ContextType>;
  Card?: CardResolvers<ContextType>;
  CardEffect?: CardEffectResolvers<ContextType>;
  ArmoryGem?: ArmoryGemResolvers<ContextType>;
  Gem?: GemResolvers<ContextType>;
  GemEffect?: GemEffectResolvers<ContextType>;
  ColosseumInfo?: ColosseumInfoResolvers<ContextType>;
  Colosseum?: ColosseumResolvers<ContextType>;
  AggregationTeamDeathMatchRank?: AggregationTeamDeathMatchRankResolvers<ContextType>;
  Aggregation?: AggregationResolvers<ContextType>;
  AggregationElimination?: AggregationEliminationResolvers<ContextType>;
  Collectible?: CollectibleResolvers<ContextType>;
  CollectiblePoint?: CollectiblePointResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  enum?: enumDirectiveResolver<any, any, ContextType>;
  globalOptions?: globalOptionsDirectiveResolver<any, any, ContextType>;
  httpOperation?: httpOperationDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = MarketsTypes.Context & NewsTypes.Context & GuildsTypes.Context & AuctionsTypes.Context & CharactersTypes.Context & ArmoriesTypes.Context & BaseMeshContext;


const baseDir = pathModule.join(typeof __dirname === 'string' ? __dirname : '/', '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".mesh/sources/Markets/schemaWithAnnotations.graphql":
      return import("./sources/Markets/schemaWithAnnotations.graphql") as T;
    
    case ".mesh/sources/News/schemaWithAnnotations.graphql":
      return import("./sources/News/schemaWithAnnotations.graphql") as T;
    
    case ".mesh/sources/Guilds/schemaWithAnnotations.graphql":
      return import("./sources/Guilds/schemaWithAnnotations.graphql") as T;
    
    case ".mesh/sources/Auctions/schemaWithAnnotations.graphql":
      return import("./sources/Auctions/schemaWithAnnotations.graphql") as T;
    
    case ".mesh/sources/Characters/schemaWithAnnotations.graphql":
      return import("./sources/Characters/schemaWithAnnotations.graphql") as T;
    
    case ".mesh/sources/Armories/schemaWithAnnotations.graphql":
      return import("./sources/Armories/schemaWithAnnotations.graphql") as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.mesh', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("🕸️  Mesh");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const newsTransforms = [];
const charactersTransforms = [];
const armoriesTransforms = [];
const auctionsTransforms = [];
const guildsTransforms = [];
const marketsTransforms = [];
const additionalTypeDefs = [] as any[];
const newsHandler = new OpenapiHandler({
              name: "News",
              config: {"source":"https://developer-lostark.game.onstove.com/swagger-doc/endpoints/news","operationHeaders":{"Authorization":"{context.headers.authorization}"}},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("News"),
              logger: logger.child("News"),
              importFn,
            });
const charactersHandler = new OpenapiHandler({
              name: "Characters",
              config: {"source":"https://developer-lostark.game.onstove.com/swagger-doc/endpoints/characters","operationHeaders":{"Authorization":"{context.headers.authorization}"}},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("Characters"),
              logger: logger.child("Characters"),
              importFn,
            });
const armoriesHandler = new OpenapiHandler({
              name: "Armories",
              config: {"source":"https://developer-lostark.game.onstove.com/swagger-doc/endpoints/armories","operationHeaders":{"Authorization":"{context.headers.authorization}"}},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("Armories"),
              logger: logger.child("Armories"),
              importFn,
            });
const auctionsHandler = new OpenapiHandler({
              name: "Auctions",
              config: {"source":"https://developer-lostark.game.onstove.com/swagger-doc/endpoints/auctions","selectQueryOrMutationField":[{"fieldName":"Auctions_GetItems","type":"Query"}],"operationHeaders":{"Authorization":"{context.headers.authorization}"}},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("Auctions"),
              logger: logger.child("Auctions"),
              importFn,
            });
const guildsHandler = new OpenapiHandler({
              name: "Guilds",
              config: {"source":"https://developer-lostark.game.onstove.com/swagger-doc/endpoints/guilds","operationHeaders":{"Authorization":"{context.headers.authorization}"}},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("Guilds"),
              logger: logger.child("Guilds"),
              importFn,
            });
const marketsHandler = new OpenapiHandler({
              name: "Markets",
              config: {"source":"https://developer-lostark.game.onstove.com/swagger-doc/endpoints/markets","operationHeaders":{"Authorization":"{context.headers.authorization}"}},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("Markets"),
              logger: logger.child("Markets"),
              importFn,
            });
sources[0] = {
          name: 'News',
          handler: newsHandler,
          transforms: newsTransforms
        }
sources[1] = {
          name: 'Characters',
          handler: charactersHandler,
          transforms: charactersTransforms
        }
sources[2] = {
          name: 'Armories',
          handler: armoriesHandler,
          transforms: armoriesTransforms
        }
sources[3] = {
          name: 'Auctions',
          handler: auctionsHandler,
          transforms: auctionsTransforms
        }
sources[4] = {
          name: 'Guilds',
          handler: guildsHandler,
          transforms: guildsTransforms
        }
sources[5] = {
          name: 'Markets',
          handler: marketsHandler,
          transforms: marketsTransforms
        }
const additionalResolvers = [] as any[]
const merger = new(StitchingMerger as any)({
        cache,
        pubsub,
        logger: logger.child('stitchingMerger'),
        store: rootStore.child('stitchingMerger')
      })

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      {
        document: GetAuctionItemsDocument,
        get rawSDL() {
          return printWithCache(GetAuctionItemsDocument);
        },
        location: 'GetAuctionItemsDocument.graphql'
      }
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler(): MeshHTTPHandler<MeshContext> {
  return createMeshHTTPHandler<MeshContext>({
    baseDir,
    getBuiltMesh: getBuiltMesh,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltMesh(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltMesh().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltMesh().then(({ subscribe }) => subscribe(...args));
export function getMeshSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltMesh().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
  return getSdk<TOperationContext, TGlobalContext>((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
export type GetAuctionItemsQueryVariables = Exact<{
  CategoryCode?: InputMaybe<Scalars['Int']>;
  ItemGrade?: InputMaybe<Scalars['String']>;
  ItemGradeQuality?: InputMaybe<Scalars['Int']>;
  ItemTier?: InputMaybe<Scalars['Int']>;
  PageNo?: InputMaybe<Scalars['Int']>;
  Sort?: InputMaybe<queryInput_Auctions_GetItems_input_Sort>;
  SortCondition?: InputMaybe<queryInput_Auctions_GetItems_input_SortCondition>;
}>;


export type GetAuctionItemsQuery = { Auctions_GetItems?: Maybe<(
    Pick<Auction, 'PageNo' | 'PageSize' | 'TotalCount'>
    & { Items?: Maybe<Array<Maybe<(
      Pick<AuctionItem, 'Grade' | 'GradeQuality' | 'Icon' | 'Level' | 'Name' | 'Tier'>
      & { AuctionInfo?: Maybe<Pick<AuctionInfo, 'BidCount' | 'BidPrice' | 'BidStartPrice' | 'BuyPrice' | 'EndDate' | 'IsCompetitive' | 'StartPrice' | 'TradeAllowCount'>>, Options?: Maybe<Array<Maybe<Pick<ItemOption, 'ClassName' | 'IsPenalty' | 'OptionName' | 'OptionNameTripod' | 'Type' | 'Value'>>>> }
    )>>> }
  )> };


export const GetAuctionItemsDocument = gql`
    query GetAuctionItems($CategoryCode: Int = 200000, $ItemGrade: String = "", $ItemGradeQuality: Int = 90, $ItemTier: Int = 3, $PageNo: Int = 1, $Sort: queryInput_Auctions_GetItems_input_Sort = BUY_PRICE, $SortCondition: queryInput_Auctions_GetItems_input_SortCondition = ASC) {
  Auctions_GetItems(
    input: {CategoryCode: $CategoryCode, ItemGrade: $ItemGrade, ItemTier: $ItemTier, PageNo: $PageNo, Sort: $Sort, SortCondition: $SortCondition, ItemGradeQuality: $ItemGradeQuality}
  ) {
    Items {
      AuctionInfo {
        BidCount
        BidPrice
        BidStartPrice
        BuyPrice
        EndDate
        IsCompetitive
        StartPrice
        TradeAllowCount
      }
      Grade
      GradeQuality
      Icon
      Level
      Name
      Options {
        ClassName
        IsPenalty
        OptionName
        OptionNameTripod
        Type
        Value
      }
      Tier
    }
    PageNo
    PageSize
    TotalCount
  }
}
    ` as unknown as DocumentNode<GetAuctionItemsQuery, GetAuctionItemsQueryVariables>;


export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    GetAuctionItems(variables?: GetAuctionItemsQueryVariables, options?: C): Promise<GetAuctionItemsQuery> {
      return requester<GetAuctionItemsQuery, GetAuctionItemsQueryVariables>(GetAuctionItemsDocument, variables, options) as Promise<GetAuctionItemsQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;