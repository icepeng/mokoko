import { AuctionItem, RequestAuctionItems } from "@mokoko/sdk";
import { categoryMap, dealOptionMap, imprintOptionMap } from "./const";
import {
  dedupeAccInfos,
  dedupeEngravePairs,
  dedupeItems,
  getIndexedItem,
} from "./hash";
import { AccInfo, EngravePair, ItemGrade } from "./interface";
import { product } from "./util";

export interface GetAuctionRequestProps {
  engravePair: EngravePair;
  acc: AccInfo;
  itemGrade: ItemGrade;
}

export function getAuctionRequest({
  engravePair,
  acc,
  itemGrade,
}: GetAuctionRequestProps): RequestAuctionItems {
  return {
    CategoryCode: categoryMap[acc.category],
    Sort: "BUY_PRICE",
    SortCondition: "ASC",
    ItemTier: 3,
    ItemGrade: itemGrade,
    ItemGradeQuality: acc.quality,
    EtcOptions: [
      ...acc.dealOptions.map(({ name, amount }) => ({
        FirstOption: 2,
        SecondOption: dealOptionMap[name],
        MinValue: amount,
      })),
      ...engravePair
        .map(({ name, amount }) => ({
          FirstOption: 3,
          SecondOption: imprintOptionMap[name],
          MinValue: amount,
        }))
        .filter(({ SecondOption }) => !!SecondOption),
    ],
    PageNo: 1,
  };
}

export interface GetRequestBundleProps {
  combinations: EngravePair[][];
  accInfos: AccInfo[];
  itemGrade: ItemGrade;
}

export function getRequestBundle({
  combinations,
  accInfos,
  itemGrade,
}: GetRequestBundleProps) {
  const pairs = combinations.reduce((arr, x) => [...arr, ...x], []);
  const pairsToSearch = dedupeEngravePairs(pairs);
  const accInfosToSearch = dedupeAccInfos(accInfos);

  return [...product(pairsToSearch, accInfosToSearch)].map(
    ([engravePair, acc]) => getAuctionRequest({ engravePair, acc, itemGrade })
  );
}

export function sanitizeItems(items: AuctionItem[]) {
  return dedupeItems(items.map((item) => getIndexedItem(item))).sort(
    (a, b) => a.AuctionInfo!.BuyPrice! - b.AuctionInfo!.BuyPrice!
  );
}
