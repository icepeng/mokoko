# @mokoko/engrave

Lostark engraving calcuation utilities

## Installation

```
yarn add @mokoko/engrave
```

## Usage

```ts
import { getSDK } from "@mokoko/sdk";
import { fetch } from "node-fetch";

async function run() {
  const sdk = getSDK({
    fetchFn: fetch,
    apiKey: "your_api_key",
  });

  sdk.getNews().then((news) => console.log(news));
}
```

## getCombinations

## getAuctionRequest

## getRequestBundle

## sanitizeItems

## compose
