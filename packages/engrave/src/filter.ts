import { penaltyOptions } from "./const";

export interface FilterProps {
  optionSum: Record<string, number>;
  price: number;
}

export type FilterFn = (props: FilterProps) => boolean;

export function filterPenalty(penalties = penaltyOptions) {
  return ({ optionSum }: FilterProps) =>
    !penalties.find((penalty) => optionSum[penalty] >= 5);
}

export function composeFilters(...filters: FilterFn[]) {
  return (props: FilterProps) => filters.every((filter) => filter(props));
}
