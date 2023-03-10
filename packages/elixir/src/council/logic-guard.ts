import { isEffectMutable } from "../effect";
import { GameState } from "../interface";
import { CouncilLogicData, CouncilLogicType } from "./interface";

// 이번 연성에서 {0} 효과가 연성될 확률을 x% 올려주지.
// 남은 모든 연성에서 {0} 효과가 연성될 확률을 x% 올려주지.
function mutateProb(state: GameState, logic: CouncilLogicData): boolean {
  if (logic.targetType === "proposed") {
    return isEffectMutable(
      state.effects[logic.targetCondition - 1],
      state.config.maxEnchant
    );
  }
  return true;
}

// 이번 연성에서 {0} 효과의 대성공 확률을 x% 올려주지.
// 남은 모든 연성에서 {0} 효과의 대성공 확률을 x% 올려주지.
function mutateLuckyRatio(state: GameState, logic: CouncilLogicData): boolean {
  if (logic.targetType === "proposed") {
    return isEffectMutable(
      state.effects[logic.targetCondition - 1],
      state.config.maxEnchant
    );
  }
  return true;
}

// <{0}> 효과의 단계를 <1> 올려보겠어. <25>% 확률로 성공하겠군.
function increaseTargetWithRatio(
  state: GameState,
  logic: CouncilLogicData
): boolean {
  if (logic.targetType === "proposed") {
    return isEffectMutable(
      state.effects[logic.targetCondition - 1],
      state.config.maxEnchant
    );
  }
  return true;
}

// <{0}> 효과의 단계를 [<+1>~<+2>]만큼 올려주지.
function increaseTargetRanged(
  state: GameState,
  logic: CouncilLogicData
): boolean {
  if (logic.targetType === "proposed") {
    return isEffectMutable(
      state.effects[logic.targetCondition - 1],
      state.config.maxEnchant
    );
  }
  return true;
}

// 대신 기회를 2회 소모하겠군.
function decreaseTurnLeft(state: GameState, logic: CouncilLogicData): boolean {
  return state.turnLeft > 1;
}

// <모든 효과>의 단계를 뒤섞도록 하지. 어떻게 뒤섞일지 보자고.
function shuffleAll(state: GameState, logic: CouncilLogicData): boolean {
  return true;
}

// 이번에는 <{0}> 효과를 <2>단계 연성해주지.
function setEnchantTargetAndAmount(
  state: GameState,
  logic: CouncilLogicData
): boolean {
  if (logic.targetType === "proposed") {
    return isEffectMutable(
      state.effects[logic.targetCondition - 1],
      state.config.maxEnchant
    );
  }
  return true;
}

// <임의의 효과> <1>개의 봉인을 해제하고, 다른 효과 <1>개를 봉인해주지.
function unlockAndLockOther(
  state: GameState,
  logic: CouncilLogicData
): boolean {
  return !!state.effects.find((eff) => eff.isLocked);
}

// <네가 고르는> 슬롯의 효과를 바꿔주지. 어떤 효과일지 보자고.
function changeEffect(state: GameState, logic: CouncilLogicData): boolean {
  return true;
}

// <{0}> 효과를 봉인하겠다.
function lockTarget(state: GameState, logic: CouncilLogicData): boolean {
  const lockedCount = state.effects.filter((eff) => eff.isLocked).length;
  if (lockedCount >= 3) {
    return false;
  }

  if (logic.targetType === "proposed") {
    return !state.effects[logic.targetCondition - 1].isLocked;
  }

  return true;
}

// 조언이 더 필요한가? 다른 조언 보기 횟수를 <2>회 늘려주지.
function increaseReroll(state: GameState, logic: CouncilLogicData): boolean {
  return true;
}

// 남은 모든 연성에서 비용이 <20%> 덜 들겠어.
function decreasePrice(state: GameState, logic: CouncilLogicData): boolean {
  return true;
}

// 이대론 안되겠어. 엘릭서의 효과와 단계를 <초기화>하겠다.
function restart(state: GameState, logic: CouncilLogicData): boolean {
  return true;
}

// 이번에 연성되는 효과는 <2>단계 올라갈거야.
function setEnchantIncreaseAmount(
  state: GameState,
  logic: CouncilLogicData
): boolean {
  return true;
}

// 이번에는 <2>개의 효과를 동시에 연성하겠어.
function setEnchantEffectCount(
  state: GameState,
  logic: CouncilLogicData
): boolean {
  return (
    state.effects.filter((eff) => isEffectMutable(eff, state.config.maxEnchant))
      .length >= logic.value[0]
  );
}

// <{0}> 효과의 단계를 [<1>~<2>] 중 하나로 바꿔주지.
function setValueRanged(state: GameState, logic: CouncilLogicData): boolean {
  if (logic.targetType === "proposed") {
    return isEffectMutable(
      state.effects[logic.targetCondition - 1],
      state.config.maxEnchant
    );
  }
  return true;
}

// <모든 효과>의 단계를 재분배하지. 어떻게 나뉠지 보자고.
function redistributeAll(state: GameState, logic: CouncilLogicData): boolean {
  return true;
}

// <네가 고르는> 효과의 단계를 전부 다른 효과에 나누지. 어떻게 나뉠지 보자고.
function redistributeSelectedToOthers(
  state: GameState,
  logic: CouncilLogicData
): boolean {
  return true;
}

// <모든 효과>의 단계를 위로 <1> 슬롯 씩 옮겨주겠어.
function shiftAll(state: GameState, logic: CouncilLogicData): boolean {
  return true;
}

// <{0}> 효과와 <{1}> 효과의 단계를 뒤바꿔줄게.
function swapValues(state: GameState, logic: CouncilLogicData): boolean {
  return (
    isEffectMutable(state.effects[logic.value[0]], state.config.maxEnchant) &&
    isEffectMutable(state.effects[logic.value[1]], state.config.maxEnchant)
  );
}

// <최고 단계> 효과 <1>개와  <최하 단계> 효과 <1>개의 단계를 뒤바꿔주지.
function swapMinMax(state: GameState, logic: CouncilLogicData): boolean {
  return true;
}

// 소진
function exhaust(state: GameState, logic: CouncilLogicData): boolean {
  return true;
}

// <최고 단계> 효과 <1>개의 단계를 <1> 올려주지. 하지만 <최하 단계> 효과 <1>개의 단계는 <1> 내려갈 거야.
function increaseMaxAndDecreaseTarget(
  state: GameState,
  logic: CouncilLogicData
): boolean {
  if (logic.targetType === "proposed") {
    return isEffectMutable(
      state.effects[logic.targetCondition - 1],
      state.config.maxEnchant
    );
  }
  return true;
}

// <최하 단계> 효과 <1>개의 단계를 <2> 올려주지. 하지만 <최고 단계> 효과 <1>개의 단계는 <2> 내려갈 거야.
function increaseMinAndDecreaseTarget(
  state: GameState,
  logic: CouncilLogicData
): boolean {
  if (logic.targetType === "proposed") {
    return isEffectMutable(
      state.effects[logic.targetCondition - 1],
      state.config.maxEnchant
    );
  }
  return true;
}

// <최하 단계> 효과 <1>개의 단계를 전부 다른 효과에 나누지. 어떻게 나뉠지 보자고.
function redistributeMinToOthers(
  state: GameState,
  logic: CouncilLogicData
): boolean {
  return true;
}

// <최고 단계> 효과 <1>개의 단계를 전부 다른 효과에 나누지. 어떻게 나뉠지 보자고.
function redistributeMaxToOthers(
  state: GameState,
  logic: CouncilLogicData
): boolean {
  return true;
}

// <최고 단계> 효과 <1>개의 단계를 <1> 소모하겠다. 대신 <최고 단계> 효과 <1>개와 <최하 단계> 효과 <1>개의 단계를 뒤바꿔주지.
function decreaseMaxAndSwapMinMax(
  state: GameState,
  logic: CouncilLogicData
): boolean {
  return true;
}

// <{0}> 효과의 단계를 <1> 소모하겠다. 대신 <{0}> 효과와 <{1}> 효과의 단계를 뒤바꿔주지.
function decreaseFirstTargetAndSwap(
  state: GameState,
  logic: CouncilLogicData
): boolean {
  return (
    isEffectMutable(state.effects[logic.value[0]], state.config.maxEnchant) &&
    isEffectMutable(state.effects[logic.value[1]], state.config.maxEnchant)
  );
}

const logicGuards: Record<
  CouncilLogicType,
  (state: GameState, logic: CouncilLogicData) => boolean
> = {
  mutateProb,
  mutateLuckyRatio,
  increaseTargetWithRatio,
  increaseTargetRanged,
  decreaseTurnLeft,
  shuffleAll,
  setEnchantTargetAndAmount,
  unlockAndLockOther,
  changeEffect,
  lockTarget,
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

export function runLogicGuard(
  state: GameState,
  logic: CouncilLogicData
): boolean {
  return logicGuards[logic.type](state, logic);
}