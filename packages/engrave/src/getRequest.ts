import { RequestAuctionItems } from "@mokoko/sdk";
import { AccInfo, AccMap, Engrave, ItemGrade } from "./interface";
import { categoryMap, dealOptionMap, imprintOptionMap } from "./table";
import { product } from "./util";

export function getAuctionRequest(
  engrave: Engrave,
  acc: AccInfo,
  searchGrade: ItemGrade
): RequestAuctionItems {
  return {
    CategoryCode: categoryMap[acc.category],
    Sort: "BUY_PRICE",
    SortCondition: "ASC",
    ItemTier: 3,
    ItemGrade: searchGrade,
    ItemGradeQuality: acc.quality,
    EtcOptions: [
      ...acc.dealOptions.map(({ name, amount }) => ({
        FirstOption: 2,
        SecondOption: dealOptionMap[name],
        MinValue: amount,
      })),
      ...Object.entries(engrave)
        .map(([name, amount]) => ({
          FirstOption: 3,
          SecondOption: imprintOptionMap[name],
          MinValue: amount,
        }))
        .filter(({ SecondOption }) => !!SecondOption),
    ],
    PageNo: 1,
  };
}

export function getRequestBundle(
  engraves: Engrave[],
  accMap: AccMap,
  searchGrade: ItemGrade
) {
  [...product(engraves, Object.values(accMap))].map(([engrave, acc]) => {});
}
