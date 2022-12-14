import type { AuctionItem } from "@mokoko/sdk";

export type AccSlot = "목걸이" | "귀걸이1" | "귀걸이2" | "반지1" | "반지2";

export type AccCategory = "목걸이" | "귀걸이" | "반지";

export type DealOption = "치명" | "특화" | "신속" | "제압" | "인내" | "숙련";

export type ItemGrade =
  | "일반"
  | "고급"
  | "희귀"
  | "영웅"
  | "전설"
  | "유물"
  | "고대"
  | "에스더";

export interface AccInfo {
  category: AccCategory;
  slot: AccSlot;
  quality: number;
  dealOptions: {
    name: DealOption;
    amount: number;
  }[];
}

export interface Engrave {
  name: string;
  amount: number;
}

export type EngravePair = [Engrave, Engrave];
export type EngraveSum = Record<string, number>;

export interface IndexedAuctionItem extends AuctionItem {
  id: string;
}
