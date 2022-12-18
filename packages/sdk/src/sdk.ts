import { ArmoryAvatar } from "./models/ArmoryAvatar";
import { ArmoryCard } from "./models/ArmoryCard";
import { ArmoryEngraving } from "./models/ArmoryEngraving";
import { ArmoryEquipment } from "./models/ArmoryEquipment";
import { ArmoryGem } from "./models/ArmoryGem";
import { ArmoryProfile } from "./models/ArmoryProfile";
import { ArmorySkill } from "./models/ArmorySkill";
import { Auction } from "./models/Auction";
import { AuctionOption } from "./models/AuctionOption";
import { CharacterInfo } from "./models/CharacterInfo";
import { Collectible } from "./models/Collectible";
import { ColosseumInfo } from "./models/ColosseumInfo";
import { Event } from "./models/Event";
import { GuildRanking } from "./models/GuildRanking";
import { MarketItemStats } from "./models/MarketItemStats";
import { MarketList } from "./models/MarketList";
import { MarketOption } from "./models/MarketOption";
import { RequestAuctionItems } from "./models/RequestAuctionItems";
import { RequestMarketItems } from "./models/RequestMarketItems";
import { Semaphore } from "@shopify/semaphore";
import { Reporter } from "./reporter";

const baseUrl = "https://developer-lostark.game.onstove.com";

type LooseFetchFn = (
  url: string,
  init?: { method?: string; body?: string; headers?: Record<string, string> }
) => Promise<{
  readonly status: number;
  readonly statusText: string;
  json(): Promise<any>;
}>;

export interface SdkProps {
  /**
   * Fetch function for isomorphic usage.
   */
  fetchFn: LooseFetchFn;

  /**
   * API Key from Lostark Open API Developer Portal.
   */
  apiKey: string;

  /**
   * API Rate limit for throttling
   * @default 100
   */
  limit?: number;

  /**
   * Maximum retry attempt on 429 error
   * @default 3
   */
  maxRetry?: number;

  /**
   * Reporter for logging usage.
   */
  reporter?: Reporter;
}

function qs(query?: Record<string, string>) {
  return query
    ? "?" +
        Object.keys(query)
          .map(
            (k) => encodeURIComponent(k) + "=" + encodeURIComponent(query[k])
          )
          .join("&")
    : "";
}

export function getSDK({
  fetchFn,
  apiKey,
  limit = 100,
  maxRetry = 3,
  reporter,
}: SdkProps) {
  const sema = new Semaphore(limit);
  const RPS = 60 * 1000;

  async function rateLimit() {
    const permit = await sema.acquire();
    setTimeout(() => permit.release(), RPS);
  }

  async function _request({
    path,
    method = "GET",
    body,
    query,
  }: {
    path: string;
    method?: "GET" | "POST";
    body?: unknown;
    query?: Record<string, string>;
  }) {
    let retryCount = 0;

    async function tryRequest(): Promise<any> {
      await rateLimit();

      const queryStr = qs(query);
      const url = baseUrl + path + queryStr;

      reporter?.info(`Request ${url}`);
      const res = await fetchFn(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
          authorization: "bearer " + apiKey,
          "content-type": "application/json",
        },
      });
      reporter?.info(`Response ${res.status} ${url}`);

      const data: any = await res.json();
      if (res.status === 200) {
        return data;
      }
      if (res.status === 429) {
        if (retryCount >= maxRetry) {
          throw new Error("Rate Limit Exceeded");
        }
        await new Promise((resolve) => setTimeout(resolve, RPS));
        return tryRequest();
      }
      if (data?.["Message"]) {
        throw new Error(data["Message"]);
      }
      throw new Error(res.status.toString());
    }

    return tryRequest();
  }

  /**
   * Returns a list of events on progress.
   * @returns Event OK
   */
  async function getNews(): Promise<Event> {
    return _request({ path: "/news/events" });
  }
  /**
   * Returns a summary of the basic stats by a character name.
   * @param characterName The name of the character
   * @returns ArmoryProfile OK
   */
  async function armoriesGetProfileInfo(
    characterName: string
  ): Promise<ArmoryProfile> {
    return _request({
      method: "GET",
      path: `/armories/characters/${characterName}/profiles`,
    });
  }

  /**
   * Returns a summary of the items equipped by a character name.
   * @param characterName The name of the character
   * @returns ArmoryEquipment OK
   */
  async function armoriesGetEquipment(
    characterName: string
  ): Promise<Array<ArmoryEquipment>> {
    return _request({
      method: "GET",
      path: `/armories/characters/${characterName}/equipment`,
    });
  }

  /**
   * Returns a summary of the avatars equipped by a character name.
   * @param characterName The name of the character
   * @returns ArmoryAvatar OK
   */
  async function armoriesGetAvatars(
    characterName: string
  ): Promise<Array<ArmoryAvatar>> {
    return _request({
      method: "GET",
      path: `/armories/characters/${characterName}/avatars`,
    });
  }

  /**
   * Returns a summary of the combat skills by a character name.
   * @param characterName The name of the character
   * @returns ArmorySkill OK
   */
  async function armoriesGetSkills(
    characterName: string
  ): Promise<Array<ArmorySkill>> {
    return _request({
      method: "GET",
      path: `/armories/characters/${characterName}/combat-skills`,
    });
  }

  /**
   * Returns a summary of the engravings equipped by a character name.
   * @param characterName The name of the character
   * @returns ArmoryEngraving OK
   */
  async function armoriesGetEngrave(
    characterName: string
  ): Promise<ArmoryEngraving> {
    return _request({
      method: "GET",
      path: `/armories/characters/${characterName}/engravings`,
    });
  }

  /**
   * Returns a summary of the cards equipped by a character name.
   * @param characterName The name of the character
   * @returns ArmoryCard OK
   */
  async function armoriesGetCard(characterName: string): Promise<ArmoryCard> {
    return _request({
      method: "GET",
      path: `/armories/characters/${characterName}/cards`,
    });
  }

  /**
   * Returns a summary of the gems equipped by a character name.
   * @param characterName The name of the character
   * @returns ArmoryGem OK
   */
  async function armoriesGetGem(characterName: string): Promise<ArmoryGem> {
    return _request({
      method: "GET",
      path: `/armories/characters/${characterName}/gems`,
    });
  }

  /**
   * Returns a summary of the proving grounds by a character name.
   * @param characterName The name of the character
   * @returns ColosseumInfo OK
   */
  async function armoriesGetColosseumInfo(
    characterName: string
  ): Promise<ColosseumInfo> {
    return _request({
      method: "GET",
      path: `/armories/characters/${characterName}/colosseums`,
    });
  }

  /**
   * Returns a summary of the collectibles by a character name.
   * @param characterName The name of the character
   * @returns Collectible OK
   */
  async function armoriesGetCollections(
    characterName: string
  ): Promise<Array<Collectible>> {
    return _request({
      method: "GET",
      path: `/armories/characters/${characterName}/collectibles`,
    });
  }

  /**
   * Returns search options for the auction house.
   * @returns AuctionOption OK
   */
  async function auctionsGetOptions(): Promise<AuctionOption> {
    return _request({
      method: "GET",
      path: "/auctions/options",
    });
  }

  /**
   * Returns all active auctions with search options.
   * @param requestAuctionItems The search options for the auction house
   * @returns Auction OK
   */
  async function auctionsGetItems(
    requestAuctionItems: RequestAuctionItems
  ): Promise<Auction> {
    return _request({
      method: "POST",
      path: "/auctions/items",
      body: requestAuctionItems,
    });
  }

  /**
   * Returns all character profiles for an account.
   * @param characterName The name of the character
   * @returns CharacterInfo OK
   */
  async function charactersGetCharacters(
    characterName: string
  ): Promise<Array<CharacterInfo>> {
    return _request({
      method: "GET",
      path: `/characters/${characterName}/siblings`,
    });
  }

  /**
   * Returns a list of guild rankings by a server.
   * @param serverName The name of the server
   * @returns GuildRanking OK
   */
  async function guildsGetGuild(
    serverName:
      | "루페온"
      | "실리안"
      | "아만"
      | "카마인"
      | "카제로스"
      | "아브렐슈드"
      | "카단"
      | "니나브"
  ): Promise<Array<GuildRanking>> {
    return _request({
      method: "GET",
      path: "/guilds/rankings",
      query: {
        serverName: serverName,
      },
    });
  }

  /**
   * Returns search options for the market.
   * @returns MarketOption OK
   */
  async function marketsGetOptions(): Promise<MarketOption> {
    return _request({
      method: "GET",
      path: "/markets/options",
    });
  }

  /**
   * Returns a market item by ID.
   * @param itemId The ID of the item
   * @returns MarketItemStats OK
   */
  async function marketsGetStats(
    itemId: number
  ): Promise<Array<MarketItemStats>> {
    return _request({
      method: "GET",
      path: `/markets/items/${itemId}`,
    });
  }

  /**
   * Returns all active market items with search options.
   * @param requestMarketItems The search options for the market
   * @returns MarketList OK
   */
  async function marketsGetItems(
    requestMarketItems: RequestMarketItems
  ): Promise<MarketList> {
    return _request({
      method: "POST",
      path: "/markets/items",
      body: requestMarketItems,
    });
  }

  return {
    getNews,
    armoriesGetAvatars,
    armoriesGetCard,
    armoriesGetCollections,
    armoriesGetColosseumInfo,
    armoriesGetEngrave,
    armoriesGetEquipment,
    armoriesGetGem,
    armoriesGetProfileInfo,
    armoriesGetSkills,
    charactersGetCharacters,
    guildsGetGuild,
    marketsGetItems,
    marketsGetOptions,
    marketsGetStats,
    auctionsGetItems,
    auctionsGetOptions,
  };
}
