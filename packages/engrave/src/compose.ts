import { PriorityQueue } from "@datastructures-js/priority-queue/src/priorityQueue";
import { AuctionItem, ItemOption } from "@mokoko/sdk";
import { dedupeAccPermutations } from "./hash";
import { ANY_ENGRAVE } from "./const";
import { FilterFn } from "./filter";
import { AccInfo, EngravePair, IndexedAuctionItem } from "./interface";
import { getItemCategory } from "./parse";
import { permutations } from "./util";

function isItemEngraved(item: AuctionItem, [engrave1, engrave2]: EngravePair) {
  const engraveOptions = item.Options!.filter(
    (option) => option.Type === "ABILITY_ENGRAVE"
  );
  const isFirstEngraved =
    engrave1.name === ANY_ENGRAVE ||
    engraveOptions.find(
      (option) =>
        option.OptionName === engrave1.name && option.Value! >= engrave1.amount
    );
  const isSecondEngraved =
    engrave2.name === ANY_ENGRAVE ||
    engraveOptions.find(
      (option) =>
        option.OptionName === engrave2.name && option.Value! >= engrave2.amount
    );

  return isFirstEngraved && isSecondEngraved;
}

function isItemQualified(item: AuctionItem, accInfo: AccInfo) {
  if ((item.GradeQuality ?? 0) < accInfo.quality) {
    return false;
  }

  if (getItemCategory(item) !== accInfo.category) {
    return false;
  }

  return accInfo.dealOptions.every((dealOption) =>
    item.Options?.find(
      (option) =>
        option.OptionName === dealOption.name &&
        (option.Value ?? 0) >= dealOption.amount
    )
  );
}

function addOptions(optionSum: Record<string, number>, options: ItemOption[]) {
  const result = { ...optionSum };
  options.forEach((option) => {
    if (!result[option.OptionName!]) {
      result[option.OptionName!] = 0;
    }
    result[option.OptionName!] += option.Value!;
  });

  return result;
}

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
   * Useful when you need to use BidPrice.
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

export function compose({
  items,
  combinations,
  accInfos,
  capacity = 200,
  priceFn = (item) => item.AuctionInfo!.BuyPrice!,
  filterOnPush,
  filterOnStep,
  onProgress,
}: ComposeProps) {
  const queue = new PriorityQueue<{
    items: IndexedAuctionItem[];
    price: number;
  }>((a, b) => b.price - a.price);

  function getMinPriceCache(entries: IndexedAuctionItem[][], len: number) {
    return Array.from({ length: len }, (_, k) => {
      let sum = 0;
      for (let i = k; i < len - 1; i += 1) {
        sum += priceFn(entries[i + 1][0]);
      }
      return sum;
    });
  }

  function chooseItems(combination: EngravePair[], accInfos: AccInfo[]) {
    const entries = combination.map((engravePair, index) => {
      return items.filter(
        (item) =>
          isItemEngraved(item, engravePair) &&
          isItemQualified(item, accInfos[index])
      );
    });
    if (entries.find((items) => items.length === 0)) {
      return;
    }

    const minPriceCache = getMinPriceCache(entries, combination.length);
    const choosedItems = new Set<IndexedAuctionItem>();

    function rec(
      price: number,
      optionSum: Record<string, number>,
      depth: number
    ) {
      const threshold = queue.front()?.price ?? Infinity;

      if (depth === combination.length) {
        if (price < threshold || queue.size() < capacity) {
          if (filterOnPush && !filterOnPush({ optionSum, price })) {
            return;
          }

          queue.push({
            items: [...choosedItems.values()],
            price,
          });
          if (queue.size() > capacity) {
            queue.pop();
          }
        }
        return;
      }

      const currentItems = entries[depth];
      const afterPriceMin = minPriceCache[depth];

      for (const item of currentItems) {
        if (choosedItems.has(item)) {
          continue;
        }
        if (price + priceFn(item) + afterPriceMin > threshold) {
          continue;
        }

        const nextOptions = addOptions(optionSum, item.Options!);
        if (filterOnStep && !filterOnStep({ optionSum: nextOptions, price })) {
          continue;
        }

        choosedItems.add(item);
        rec(price + priceFn(item), nextOptions, depth + 1);
        choosedItems.delete(item);
      }
    }

    rec(0, {}, 0);
  }

  const accPermutations = dedupeAccPermutations([...permutations(accInfos)]);
  const total = accPermutations.length * combinations.length;
  let current = 0;
  for (const combination of combinations) {
    for (const infos of accPermutations) {
      chooseItems(combination, infos);

      current += 1;
      onProgress?.({ total, current });
    }
  }

  return queue.toArray().reverse();
}
