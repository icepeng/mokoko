// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace AuctionsTypes {
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
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: Date | string;
  ObjMap: any;
};

export type Query = {
  /** Returns search options for the auction house. */
  Auctions_GetOptions?: Maybe<AuctionOption>;
  /** Returns all active auctions with search options. */
  Auctions_GetItems?: Maybe<Auction>;
};


export type QueryAuctions_GetItemsArgs = {
  input: RequestAuctionItems_Input;
};

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

export type Category = {
  Subs?: Maybe<Array<Maybe<CategoryItem>>>;
  Code?: Maybe<Scalars['Int']>;
  CodeName?: Maybe<Scalars['String']>;
};

export type CategoryItem = {
  Code?: Maybe<Scalars['Int']>;
  CodeName?: Maybe<Scalars['String']>;
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
      /** Returns search options for the auction house. **/
  Auctions_GetOptions: InContextSdkMethod<Query['Auctions_GetOptions'], {}, MeshContext>,
  /** Returns all active auctions with search options. **/
  Auctions_GetItems: InContextSdkMethod<Query['Auctions_GetItems'], QueryAuctions_GetItemsArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["Auctions"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
