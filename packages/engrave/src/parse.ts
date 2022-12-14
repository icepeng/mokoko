import { AuctionItem } from "@mokoko/sdk";
import { AccCategory } from "./interface";

export function getItemCategory(item: AuctionItem): AccCategory {
  if (item.Name?.endsWith("목걸이")) {
    return "목걸이";
  }
  if (item.Name?.endsWith("귀걸이")) {
    return "귀걸이";
  }
  if (item.Name?.endsWith("반지")) {
    return "반지";
  }

  throw new Error("Unexpected Item Name: " + item.Name);
}
