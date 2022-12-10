// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace GuildsTypes {
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
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: Date | string;
  ObjMap: any;
};

export type Query = {
  /** Returns a list of guild rankings by a server. */
  Guilds_GetGuild?: Maybe<Array<Maybe<GuildRanking>>>;
};


export type QueryGuilds_GetGuildArgs = {
  serverName: queryInput_Guilds_GetGuild_serverName;
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
      /** Returns a list of guild rankings by a server. **/
  Guilds_GetGuild: InContextSdkMethod<Query['Guilds_GetGuild'], QueryGuilds_GetGuildArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["Guilds"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
