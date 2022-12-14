# @mokoko/sdk

Unofficial SDK of [Lostark Open API](https://developer-lostark.game.onstove.com/)

## Installation

```
yarn add @mokoko/sdk
```

## Usage (Node.js)

```ts
import { getSDK } from "@mokoko/sdk";
import { fetch } from "node-fetch";

const sdk = getSDK({
  fetchFn: fetch,
  apiKey: "your_api_key",
});

sdk.getNews().then((news) => console.log(news));
```

## Throttling

```ts
import { getSDK } from "@mokoko/sdk";
import { fetch } from "node-fetch";

const sdk = getSDK({
  fetchFn: fetch,
  apiKey: "your_api_key",
  limit: 100, // Rate limit of your client
});

async function run() {
  const results = await Promise.all(
    MANY_AUCTION_REQUESTS.map((req) => sdk.auctionsGetItems(req))
  ); // Async operations are throttled through SDK.

  // do something...
}
```

## getSDK() options

```ts
export interface SdkProps {
  /**
   * Fetch function for isomorphic usage.
   */
  fetchFn:
    | ((url: string, init?: RequestInit) => Promise<Response>)
    | ((url: string, init?: NodeRequestInit) => Promise<NodeResponse>);

  /**
   * API Key from Lostark Open API Developer Portal.
   */
  apiKey: string;

  /**
   * API Rate limit for throttling
   * @default 100
   */
  limit?: number;

  /**
   * Reporter for logging usage.
   */
  reporter?: Reporter;
}
```
