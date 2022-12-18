# @mokoko/engrave

Lostark engraving calcuation utilities

## Installation

```
yarn add @mokoko/engrave
```

## Usage

```ts
// 1. Setup AccInfo and ItemGrade
const accInfos: AccInfo[] = [
  {
    slot: "목걸이",
    category: "목걸이",
    quality: 90,
    dealOptions: [
      { name: "치명", amount: 0 },
      { name: "특화", amount: 0 },
    ],
  },
  {
    slot: "귀걸이1",
    category: "귀걸이",
    quality: 80,
    dealOptions: [{ name: "특화", amount: 0 }],
  },
  {
    slot: "귀걸이2",
    category: "귀걸이",
    quality: 80,
    dealOptions: [{ name: "특화", amount: 0 }],
  },
  {
    slot: "반지1",
    category: "반지",
    quality: 50,
    dealOptions: [{ name: "특화", amount: 0 }],
  },
  {
    slot: "반지2",
    category: "반지",
    quality: 50,
    dealOptions: [{ name: "특화", amount: 0 }],
  },
];
const itemGrade = "고대";

// 2. Generate combiniations from target engrave
const combinations = getCombinations({
  target: {
    원한: 3,
    "예리한 둔기": 3,
    돌격대장: 15,
    바리케이드: 8,
    아드레날린: 7,
  },
  length: accInfos.length,
  itemGrade,
});

// 3. Get array of RequestAuctionItems
const requests = getRequestBundle({
  combinations,
  accInfos,
  itemGrade,
});

// 4. Get items from API
const sdk = getSDK({
  fetchFn: fetch,
  apiKey: process.env.API_KEY!,
});
const auctions = await Promise.all(
  requests.map((req) => sdk.auctionsGetItems(req))
);

// 5. Sanitize and sort auction items
const items = sanitizeItems(
  auctions
    .flatMap((auction) => auction.Items ?? [])
    .filter((item) => item.AuctionInfo!.BuyPrice! > 0)
);

// 6. Calculate price-optimized item composition
const results = compose({
  items,
  combinations,
  accInfos,
  filterOnStep: filterPenalty(),
});
```

## compose

```ts
interface ComposeProps {
  items: IndexedAuctionItem[];
  combinations: EngravePair[][];
  accInfos: AccInfo[];

  /**
   * Max size of result array.
   */
  capacity?: number;

  /**
   * Function that returns price of item.
   * Useful when you need to use BidStartPrice.
   */
  priceFn?: (item: AuctionItem) => number;

  /**
   * Filter function that runs on item composition pushes to result array.
   * Useful when you have to filter about composed items e.g. total deal option.
   */
  filterOnPush?: FilterFn;

  /**
   * Filter function that runs on every step of item composition.
   * Useful when you can early-quit before items are fully composed e.g. penalty option.
   * Setting this filter may increase performance.
   */
  filterOnStep?: FilterFn;

  /**
   * Callback function that called on each chunk finished.
   * Useful for progress report.
   */
  onProgress?: (progress: { total: number; current: number }) => void;
}
```

## Running e2e test

1. Copy .env.example and rename to .env
2. Set your API key in .env file
3. run `yarn e2e`
