import { AuctionItem, ItemOption } from "@mokoko/sdk";
import { AccInfo, EngravePair, IndexedAuctionItem } from "./interface";

function hashItemOptions(options: ItemOption[]) {
  return options
    .map((option) => `${option.OptionName}-${option.Value}`)
    .join("_");
}

export function hashItem(item: AuctionItem) {
  return [
    item.Name,
    hashItemOptions(item.Options ?? []),
    item.AuctionInfo?.BidStartPrice,
    item.AuctionInfo?.BuyPrice,
    item.AuctionInfo?.TradeAllowCount,
    item.AuctionInfo?.EndDate,
  ].join("_");
}

export function getIndexedItem(item: AuctionItem): IndexedAuctionItem {
  return { id: hashItem(item), ...item };
}

export function dedupeItems(items: IndexedAuctionItem[]): IndexedAuctionItem[] {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

export function hashEngravePair(pair: EngravePair) {
  const [first, second] = pair;
  const comparison = first.name.localeCompare(second.name);

  if (comparison > 0) {
    return `${first.name}_${first.amount}_${second.name}_${second.amount}`;
  }
  return `${second.name}_${second.amount}_${first.name}_${first.amount}`;
}

export function dedupeEngravePairs(items: EngravePair[]): EngravePair[] {
  return [
    ...new Map(items.map((item) => [hashEngravePair(item), item])).values(),
  ];
}

export function hashAccInfo(accInfo: AccInfo) {
  return [
    accInfo.category,
    accInfo.quality,
    ...accInfo.dealOptions.map((option) => `${option.name}-${option.amount}`),
  ].join("_");
}

export function dedupeAccInfos(accInfos: AccInfo[]): AccInfo[] {
  return [
    ...new Map(accInfos.map((info) => [hashAccInfo(info), info])).values(),
  ];
}

export function dedupeAccPermutations(permutations: AccInfo[][]): AccInfo[][] {
  return [
    ...new Map(
      permutations.map((accInfos) => [
        accInfos.map(hashAccInfo).join("_"),
        accInfos,
      ])
    ).values(),
  ];
}
