import { Council, GameState } from "./interface";
import chance from "./rng";

export function pickCouncil(state: GameState, sageIndex: number): string {
  const availableCouncils = councils.filter((council) =>
    council.condition(state, sageIndex)
  );
  if (availableCouncils.length === 0) {
    throw new Error("No council available");
  }

  const weightTable = availableCouncils.map((council) => council.weight);
  const selected = chance.weighted(availableCouncils, weightTable);
  return selected.id;
}

export function getCouncilById(id: string): Council {
  const council = councilRecord[id];
  if (!council) {
    throw new Error(`Unknown council id: ${id}`);
  }
  return council;
}
