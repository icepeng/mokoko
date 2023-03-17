import * as Game from "./game";
import * as Board from "./board";
import type * as CouncilLogic from "./council-logic";

// 이번 연성에서 {0} 효과가 연성될 확률을 x% 올려주지.
// 남은 모든 연성에서 {0} 효과가 연성될 확률을 x% 올려주지.
function mutateProb(game: Game.T, logic: CouncilLogic.T): boolean {
  if (logic.targetType === "proposed") {
    return Game.query.isEffectMutable(game, logic.targetCondition - 1);
  }
  return true;
}

// 이번 연성에서 {0} 효과의 대성공 확률을 x% 올려주지.
// 남은 모든 연성에서 {0} 효과의 대성공 확률을 x% 올려주지.
function mutateLuckyRatio(game: Game.T, logic: CouncilLogic.T): boolean {
  if (logic.targetType === "proposed") {
    return Game.query.isEffectMutable(game, logic.targetCondition - 1);
  }
  return true;
}

// <{0}> 효과의 단계를 <1> 올려보겠어. <25>% 확률로 성공하겠군.
function increaseTargetWithRatio(game: Game.T, logic: CouncilLogic.T): boolean {
  if (logic.targetType === "proposed") {
    return Game.query.isEffectMutable(game, logic.targetCondition - 1);
  }
  return true;
}

// <{0}> 효과의 단계를 [<+1>~<+2>]만큼 올려주지.
function increaseTargetRanged(game: Game.T, logic: CouncilLogic.T): boolean {
  if (logic.targetType === "proposed") {
    return Game.query.isEffectMutable(game, logic.targetCondition - 1);
  }
  return true;
}

// 대신 기회를 2회 소모하겠군.
function decreaseTurnLeft(game: Game.T, logic: CouncilLogic.T): boolean {
  return game.state.turnLeft > 1;
}

// <모든 효과>의 단계를 뒤섞도록 하지. 어떻게 뒤섞일지 보자고.
function shuffleAll(game: Game.T, logic: CouncilLogic.T): boolean {
  return true;
}

// 이번에는 <{0}> 효과를 <2>단계 연성해주지.
function setEnchantTargetAndAmount(
  game: Game.T,
  logic: CouncilLogic.T
): boolean {
  if (logic.targetType === "proposed") {
    return Game.query.isEffectMutable(game, logic.targetCondition - 1);
  }
  return true;
}

// <임의의 효과> <1>개의 봉인을 해제하고, 다른 효과 <1>개를 봉인해주지.
function unsealAndSealOther(game: Game.T, logic: CouncilLogic.T): boolean {
  return Board.query.getSealedCount(game.state.board) > 0;
}

// <네가 고르는> 슬롯의 효과를 바꿔주지. 어떤 효과일지 보자고.
function changeEffect(game: Game.T, logic: CouncilLogic.T): boolean {
  return true;
}

// <{0}> 효과를 봉인하겠다.
function sealTarget(game: Game.T, logic: CouncilLogic.T): boolean {
  const sealedCount = Board.query.getSealedCount(game.state.board);
  if (sealedCount >= 3) {
    return false;
  }

  if (logic.targetType === "proposed") {
    return !Board.query.isIndexSealed(
      game.state.board,
      logic.targetCondition - 1
    );
  }

  return true;
}

// 조언이 더 필요한가? 다른 조언 보기 횟수를 <2>회 늘려주지.
function increaseReroll(game: Game.T, logic: CouncilLogic.T): boolean {
  return true;
}

// 남은 모든 연성에서 비용이 <20%> 덜 들겠어.
function decreasePrice(game: Game.T, logic: CouncilLogic.T): boolean {
  return true;
}

// 이대론 안되겠어. 엘릭서의 효과와 단계를 <초기화>하겠다.
function restart(game: Game.T, logic: CouncilLogic.T): boolean {
  return true;
}

// 이번에 연성되는 효과는 <2>단계 올라갈거야.
function setEnchantIncreaseAmount(
  game: Game.T,
  logic: CouncilLogic.T
): boolean {
  return true;
}

// 이번에는 <2>개의 효과를 동시에 연성하겠어.
function setEnchantEffectCount(game: Game.T, logic: CouncilLogic.T): boolean {
  return (
    Board.query.getMutableCount(game.state.board, game.config.maxEnchant) >=
    logic.value[0]
  );
}

// <{0}> 효과의 단계를 [<1>~<2>] 중 하나로 바꿔주지.
function setValueRanged(game: Game.T, logic: CouncilLogic.T): boolean {
  if (logic.targetType === "proposed") {
    return Game.query.isEffectMutable(game, logic.targetCondition - 1);
  }
  return true;
}

// <모든 효과>의 단계를 재분배하지. 어떻게 나뉠지 보자고.
function redistributeAll(game: Game.T, logic: CouncilLogic.T): boolean {
  return true;
}

// <네가 고르는> 효과의 단계를 전부 다른 효과에 나누지. 어떻게 나뉠지 보자고.
function redistributeSelectedToOthers(
  game: Game.T,
  logic: CouncilLogic.T
): boolean {
  return true;
}

// <모든 효과>의 단계를 위로 <1> 슬롯 씩 옮겨주겠어.
function shiftAll(game: Game.T, logic: CouncilLogic.T): boolean {
  return true;
}

// <{0}> 효과와 <{1}> 효과의 단계를 뒤바꿔줄게.
function swapValues(game: Game.T, logic: CouncilLogic.T): boolean {
  return (
    Game.query.isEffectMutable(game, logic.value[0]) &&
    Game.query.isEffectMutable(game, logic.value[1])
  );
}

// <최고 단계> 효과 <1>개와  <최하 단계> 효과 <1>개의 단계를 뒤바꿔주지.
function swapMinMax(game: Game.T, logic: CouncilLogic.T): boolean {
  return true;
}

// 소진
function exhaust(game: Game.T, logic: CouncilLogic.T): boolean {
  return true;
}

// <최고 단계> 효과 <1>개의 단계를 <1> 올려주지. 하지만 <최하 단계> 효과 <1>개의 단계는 <1> 내려갈 거야.
function increaseMaxAndDecreaseTarget(
  game: Game.T,
  logic: CouncilLogic.T
): boolean {
  if (logic.targetType === "proposed") {
    return Game.query.isEffectMutable(game, logic.targetCondition - 1);
  }
  return true;
}

// <최하 단계> 효과 <1>개의 단계를 <2> 올려주지. 하지만 <최고 단계> 효과 <1>개의 단계는 <2> 내려갈 거야.
function increaseMinAndDecreaseTarget(
  game: Game.T,
  logic: CouncilLogic.T
): boolean {
  if (logic.targetType === "proposed") {
    return Game.query.isEffectMutable(game, logic.targetCondition - 1);
  }
  return true;
}

// <최하 단계> 효과 <1>개의 단계를 전부 다른 효과에 나누지. 어떻게 나뉠지 보자고.
function redistributeMinToOthers(game: Game.T, logic: CouncilLogic.T): boolean {
  return true;
}

// <최고 단계> 효과 <1>개의 단계를 전부 다른 효과에 나누지. 어떻게 나뉠지 보자고.
function redistributeMaxToOthers(game: Game.T, logic: CouncilLogic.T): boolean {
  return true;
}

// <최고 단계> 효과 <1>개의 단계를 <1> 소모하겠다. 대신 <최고 단계> 효과 <1>개와 <최하 단계> 효과 <1>개의 단계를 뒤바꿔주지.
function decreaseMaxAndSwapMinMax(
  game: Game.T,
  logic: CouncilLogic.T
): boolean {
  return true;
}

// <{0}> 효과의 단계를 <1> 소모하겠다. 대신 <{0}> 효과와 <{1}> 효과의 단계를 뒤바꿔주지.
function decreaseFirstTargetAndSwap(
  game: Game.T,
  logic: CouncilLogic.T
): boolean {
  return (
    Game.query.isEffectMutable(game, logic.value[0]) &&
    Game.query.isEffectMutable(game, logic.value[1])
  );
}

const logicGuards: Record<
  CouncilLogic.CouncilLogicType,
  (game: Game.T, logic: CouncilLogic.T) => boolean
> = {
  mutateProb,
  mutateLuckyRatio,
  increaseTargetWithRatio,
  increaseTargetRanged,
  decreaseTurnLeft,
  shuffleAll,
  setEnchantTargetAndAmount,
  unsealAndSealOther,
  changeEffect,
  sealTarget,
  increaseReroll,
  decreasePrice,
  restart,
  setEnchantIncreaseAmount,
  setEnchantEffectCount,
  setValueRanged,
  redistributeAll,
  redistributeSelectedToOthers,
  shiftAll,
  swapValues,
  swapMinMax,
  exhaust,
  increaseMaxAndDecreaseTarget,
  increaseMinAndDecreaseTarget,
  redistributeMinToOthers,
  redistributeMaxToOthers,
  decreaseMaxAndSwapMinMax,
  decreaseFirstTargetAndSwap,
};

export function runLogicGuard(game: Game.T, logic: CouncilLogic.T): boolean {
  return logicGuards[logic.type](game, logic);
}
