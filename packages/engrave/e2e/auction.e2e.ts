import { Auction, getSDK } from "@mokoko/sdk";
import * as fs from "fs";
import { AccInfo } from "interface";
import fetch from "node-fetch";
import * as path from "path";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { compose } from "../src/compose";
import { filterPenalty } from "../src/filter";
import { getRequestBundle, sanitizeItems } from "../src/request";
import { getCombinations } from "../src/scan";

const UPDATE_FIXTURES = false;
const UPDATE_SNAPSHOTS = false;

test("e2e", async () => {
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
  async function getAuctions(): Promise<Auction[]> {
    const auctionsPath = path.join(__dirname, "__fixture__", "auctions.json");

    if (!UPDATE_FIXTURES) {
      return JSON.parse(fs.readFileSync(auctionsPath, "utf8"));
    }

    const sdk = getSDK({
      fetchFn: fetch,
      apiKey: process.env.API_KEY!,
    });
    const auctions = await Promise.all(
      requests.map((req) => sdk.auctionsGetItems(req))
    );
    fs.writeFileSync(auctionsPath, JSON.stringify(auctions, null, 2), "utf8");

    return auctions;
  }

  const auctions = await getAuctions();

  // 5. Sanitize and sort auction items
  const items = sanitizeItems(
    auctions.flatMap((auction) => auction.Items ?? [])
  );

  // 6. Calculate price-optimized item composition
  const results = compose({
    items,
    combinations,
    accInfos,
    filterOnStep: filterPenalty(),
  });
  const compressedResults = JSON.stringify(
    results.map((x) => ({
      ...x,
      items: x.items.map((y) => y.id),
    })),
    null,
    2
  );

  const resultPath = path.join(__dirname, "__snapshot__", "result.json");
  if (UPDATE_SNAPSHOTS) {
    fs.writeFileSync(resultPath, compressedResults, "utf8");
  }

  const snapshot = fs.readFileSync(resultPath, "utf8");
  assert.fixture(compressedResults, snapshot);
});

test.run();
