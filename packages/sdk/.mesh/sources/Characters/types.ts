// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace CharactersTypes {
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
  ObjMap: any;
};

export type Query = {
  /** Returns all character profiles for an account. */
  Characters_GetCharacters?: Maybe<Array<Maybe<CharacterInfo>>>;
};


export type QueryCharacters_GetCharactersArgs = {
  characterName: Scalars['String'];
};

export type CharacterInfo = {
  ServerName?: Maybe<Scalars['String']>;
  CharacterName?: Maybe<Scalars['String']>;
  CharacterLevel?: Maybe<Scalars['Int']>;
  CharacterClassName?: Maybe<Scalars['String']>;
  ItemAvgLevel?: Maybe<Scalars['String']>;
  ItemMaxLevel?: Maybe<Scalars['String']>;
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
      /** Returns all character profiles for an account. **/
  Characters_GetCharacters: InContextSdkMethod<Query['Characters_GetCharacters'], QueryCharacters_GetCharactersArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["Characters"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
