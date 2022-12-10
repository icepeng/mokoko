// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace MarketsTypes {
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
  /** The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
  Float: number;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: bigint;
  ObjMap: any;
};

export type Query = {
  /** Returns search options for the market. */
  Markets_GetOptions?: Maybe<MarketOption>;
  /** Returns a market item by ID. */
  Markets_GetStats?: Maybe<Array<Maybe<MarketItemStats>>>;
};


export type QueryMarkets_GetStatsArgs = {
  itemId: Scalars['BigInt'];
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

export type Mutation = {
  /** Returns all active market items with search options. */
  Markets_GetItems?: Maybe<MarketList>;
};


export type MutationMarkets_GetItemsArgs = {
  input: RequestMarketItems_Input;
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

  export type QuerySdk = {
      /** Returns search options for the market. **/
  Markets_GetOptions: InContextSdkMethod<Query['Markets_GetOptions'], {}, MeshContext>,
  /** Returns a market item by ID. **/
  Markets_GetStats: InContextSdkMethod<Query['Markets_GetStats'], QueryMarkets_GetStatsArgs, MeshContext>
  };

  export type MutationSdk = {
      /** Returns all active market items with search options. **/
  Markets_GetItems: InContextSdkMethod<Mutation['Markets_GetItems'], MutationMarkets_GetItemsArgs, MeshContext>
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["Markets"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
