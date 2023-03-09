import { getInitialGameState } from "../game";
import { GameState, Mutation, UiState } from "../interface";
import chance from "../rng";
import { CouncilLogicData, CouncilLogicType } from "./interface";
import getTargets from "./target";
import { cycle, partition } from "./util";

// 이번 연성에서 {0} 효과가 연성될 확률을 x% 올려주지.
// 남은 모든 연성에서 {0} 효과가 연성될 확률을 x% 올려주지.
function mutateProb(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const targets = getTargets(state, ui, logic);

  const mutations: Mutation[] = targets.map((index) => {
    return {
      target: "prob",
      index,
      value: logic.value[0] / 10000,
      remainTurn: logic.remainTurn,
    };
  });

  return {
    ...state,
    mutations: [...state.mutations, ...mutations],
  };
}

// 이번 연성에서 {0} 효과의 대성공 확률을 x% 올려주지.
// 남은 모든 연성에서 {0} 효과의 대성공 확률을 x% 올려주지.
function mutateLuckyRatio(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const targets = getTargets(state, ui, logic);

  const mutations: Mutation[] = targets.map((index) => {
    return {
      target: "luckyRatio",
      index,
      value: logic.value[0] / 10000,
      remainTurn: logic.remainTurn,
    };
  });

  return {
    ...state,
    mutations: [...state.mutations, ...mutations],
  };
}

// <{0}> 효과의 단계를 <1> 올려보겠어. <25>% 확률로 성공하겠군.
function increaseTargetWithRatio(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const targets = getTargets(state, ui, logic);

  const effects = state.effects.map((eff, index) => {
    if (targets.includes(index)) {
      const isSuccess =
        logic.ratio < 10000
          ? chance.bool({ likelihood: logic.ratio / 100 })
          : true;

      if (isSuccess) {
        return {
          ...eff,
          value: eff.value + logic.value[0],
        };
      }
      return eff;
    }

    return eff;
  });

  return {
    ...state,
    effects,
  };
}

// <{0}> 효과의 단계를 [<+1>~<+2>]만큼 올려주지.
function increaseTargetRanged(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const targets = getTargets(state, ui, logic);

  const effects = state.effects.map((eff, index) => {
    if (targets.includes(index)) {
      const diff = chance.integer({
        min: logic.value[0],
        max: logic.value[1],
      });

      return {
        ...eff,
        value: eff.value + diff,
      };
    }

    return eff;
  });

  return {
    ...state,
    effects,
  };
}

// 대신 기회를 2회 소모하겠군.
function decreaseTurnLeft(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  return {
    ...state,
    turnLeft: state.turnLeft - logic.value[0],
  };
}

// <모든 효과>의 단계를 뒤섞도록 하지. 어떻게 뒤섞일지 보자고.
function shuffleAll(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const effects = chance.shuffle(state.effects);

  return {
    ...state,
    effects,
  };
}

// 이번에는 <{0}> 효과를 <2>단계 연성해주지.
function setEnchantTargetAndAmount(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const targets = getTargets(state, ui, logic);

  const mutations = targets.flatMap<Mutation>((index) => {
    return [
      {
        target: "prob",
        index,
        value: logic.value[0] / 10000,
        remainTurn: logic.remainTurn,
      },
      {
        target: "enchantIncreaseAmount",
        index: -1,
        value: logic.value[1],
        remainTurn: logic.remainTurn,
      },
    ];
  });

  return {
    ...state,
    mutations,
  };
}

// <임의의 효과> <1>개의 봉인을 해제하고, 다른 효과 <1>개를 봉인해주지.
function unlockTargetAndLockOther(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const lockedIndexes = [0, 1, 2, 3, 4].filter(
    (index) => state.effects[index].isLocked
  );
  const unlockedIndexes = [0, 1, 2, 3, 4].filter(
    (index) => !state.effects[index].isLocked
  );

  const lockedIndex = chance.pickone(lockedIndexes);
  const unlockedIndex = chance.pickone(unlockedIndexes);

  const effects = state.effects.map((eff, index) => {
    if (index === lockedIndex) {
      return {
        ...eff,
        isLocked: false,
      };
    }

    if (index === unlockedIndex) {
      return {
        ...eff,
        isLocked: true,
      };
    }

    return eff;
  });

  return {
    ...state,
    effects,
  };
}

// TODO: implement this
// <네가 고르는> 슬롯의 효과를 바꿔주지. 어떤 효과일지 보자고.
function changeEffect(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  return state;
}

// <{0}> 효과를 봉인하겠다.
function lockTarget(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const targets = getTargets(state, ui, logic);

  const effects = state.effects.map((eff, index) => {
    if (targets.includes(index)) {
      return {
        ...eff,
        isLocked: true,
      };
    }

    return eff;
  });

  return {
    ...state,
    effects,
  };
}

// 조언이 더 필요한가? 다른 조언 보기 횟수를 <2>회 늘려주지.
function increaseReroll(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  return {
    ...state,
    rerollLeft: state.rerollLeft + logic.value[0],
  };
}

// 남은 모든 연성에서 비용이 <20%> 덜 들겠어.
function decreasePrice(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  return state;
}

// 이대론 안되겠어. 엘릭서의 효과와 단계를 <초기화>하겠다.
function restart(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  return getInitialGameState(state.config);
}

// 이번에 연성되는 효과는 <2>단계 올라갈거야.
function setEnchantIncreaseAmount(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const mutation: Mutation = {
    target: "enchantIncreaseAmount",
    index: -1,
    value: logic.value[0],
    remainTurn: logic.remainTurn,
  };

  return {
    ...state,
    mutations: [...state.mutations, mutation],
  };
}

// 이번에는 <2>개의 효과를 동시에 연성하겠어.
function setEnchantEffectCount(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const mutation: Mutation = {
    target: "enchantEffectCount",
    index: -1,
    value: logic.value[0],
    remainTurn: logic.remainTurn,
  };

  return {
    ...state,
    mutations: [...state.mutations, mutation],
  };
}

// <{0}> 효과의 단계를 [<1>~<2>] 중 하나로 바꿔주지.
function setValueRanged(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const targets = getTargets(state, ui, logic);

  const effects = state.effects.map((eff, index) => {
    if (targets.includes(index)) {
      const value = chance.integer({
        min: logic.value[0],
        max: logic.value[1],
      });

      return {
        ...eff,
        value,
      };
    }

    return eff;
  });

  return {
    ...state,
    effects,
  };
}

// <모든 효과>의 단계를 재분배하지. 어떻게 나뉠지 보자고.
function redistributeAll(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const totalValue = state.effects
    .filter((eff) => !eff.isLocked)
    .reduce((acc, eff) => acc + eff.value, 0);

  const partitionsArr = partition(totalValue, 5).filter((arr, i) => {
    if (state.effects[i].isLocked) {
      return arr[i] === state.effects[i].value;
    }
    return true;
  });

  const picked = chance.pickone(partitionsArr);

  const effects = state.effects.map((eff, index) => {
    if (eff.isLocked) {
      return eff;
    }

    return {
      ...eff,
      value: picked[index],
    };
  });

  return {
    ...state,
    effects,
  };
}

// <네가 고르는> 효과의 단계를 전부 다른 효과에 나누지. 어떻게 나뉠지 보자고.
function redistributeSelectedToOthers(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const selectedValue = state.effects[ui.selectedEffectIndex].value;

  const partitionsArr = partition(selectedValue, 5).filter((arr, i) => {
    if (i === ui.selectedEffectIndex) {
      return arr[i] === state.effects[i].value;
    }
    if (state.effects[i].isLocked) {
      return arr[i] === state.effects[i].value;
    }
    return true;
  });

  const picked = chance.pickone(partitionsArr);

  const effects = state.effects.map((eff, index) => {
    if (eff.isLocked) {
      return eff;
    }

    return {
      ...eff,
      value: picked[index],
    };
  });

  return {
    ...state,
    effects,
  };
}

// <모든 효과>의 단계를 위로 <1> 슬롯 씩 옮겨주겠어.
function shiftAll(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const values = state.effects.map((eff) => eff.value);
  const direction = logic.value[0] as 0 | 1; // 0=up, 1=down

  const shiftedIndexes = [0, 1, 2, 3, 4].map((i) => {
    if (state.effects[i].isLocked) {
      return i;
    }
    let j = i;
    while (state.effects[j].isLocked) {
      j = cycle(j, 5, direction);
    }
    return j;
  });

  const effects = state.effects.map((eff, index) => {
    return {
      ...eff,
      value: values[shiftedIndexes[index]],
    };
  });

  return {
    ...state,
    effects,
  };
}

// <{0}> 효과와 <{1}> 효과의 단계를 뒤바꿔줄게.
function swapTargets(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const [target1, target2] = logic.value;

  const effects = state.effects.map((eff, index) => {
    if (index === target1) {
      return { ...state.effects[target2] };
    } else if (index === target2) {
      return { ...state.effects[target1] };
    }

    return eff;
  });

  return {
    ...state,
    effects,
  };
}

// <최고 단계> 효과 <1>개와  <최하 단계> 효과 <1>개의 단계를 뒤바꿔주지.
function swapMinMax(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const values = state.effects
    .filter((eff) => !eff.isLocked)
    .map((eff) => eff.value);
  const max = Math.max(...values);
  const min = Math.min(...values);

  const maxIndexes = [0, 1, 2, 3, 4].filter(
    (index) => state.effects[index].value === max
  );
  const minIndexes = [0, 1, 2, 3, 4].filter(
    (index) => state.effects[index].value === min
  );

  const pickedMax = chance.pickone(maxIndexes);
  const pickedMin = chance.pickone(minIndexes);

  const effects = state.effects.map((eff, index) => {
    if (index === pickedMax) {
      return {
        ...eff,
        value: min,
      };
    } else if (index === pickedMin) {
      return {
        ...eff,
        value: max,
      };
    }

    return eff;
  });

  return {
    ...state,
    effects,
  };
}

// 소진
function exhaust(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const sageIndex = logic.value[0];

  const sages = state.sages.map((sage, index) => {
    if (index === sageIndex) {
      return {
        ...sage,
        isExhausted: true,
      };
    }

    return sage;
  });

  return {
    ...state,
    sages,
  };
}

// <최고 단계> 효과 <1>개의 단계를 <1> 올려주지. 하지만 <최하 단계> 효과 <1>개의 단계는 <1> 내려갈 거야.
function increaseMaxAndDecreaseTarget(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const values = state.effects
    .filter((eff) => !eff.isLocked)
    .map((eff) => eff.value);
  const max = Math.max(...values);

  const maxIndexes = [0, 1, 2, 3, 4].filter(
    (index) => state.effects[index].value === max
  );

  const pickedMax = chance.pickone(maxIndexes);

  const targets = getTargets(state, ui, logic);

  const effects = state.effects.map((eff, index) => {
    if (index === pickedMax) {
      return {
        ...eff,
        value: eff.value + logic.value[0],
      };
    }
    if (targets.includes(index)) {
      return {
        ...eff,
        value: eff.value + logic.value[1],
      };
    }

    return eff;
  });

  return {
    ...state,
    effects,
  };
}

// <최하 단계> 효과 <1>개의 단계를 <2> 올려주지. 하지만 <최고 단계> 효과 <1>개의 단계는 <2> 내려갈 거야.
function increaseMinAndDecreaseTarget(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const values = state.effects
    .filter((eff) => !eff.isLocked)
    .map((eff) => eff.value);
  const min = Math.min(...values);

  const minIndexes = [0, 1, 2, 3, 4].filter(
    (index) => state.effects[index].value === min
  );

  const pickedMin = chance.pickone(minIndexes);

  const targets = getTargets(state, ui, logic);

  const effects = state.effects.map((eff, index) => {
    if (index === pickedMin) {
      return {
        ...eff,
        value: eff.value + logic.value[0],
      };
    }
    if (targets.includes(index)) {
      return {
        ...eff,
        value: eff.value + logic.value[1],
      };
    }

    return eff;
  });

  return {
    ...state,
    effects,
  };
}

// <최하 단계> 효과 <1>개의 단계를 전부 다른 효과에 나누지. 어떻게 나뉠지 보자고.
function redistributeMinToOthers(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const values = state.effects
    .filter((eff) => !eff.isLocked)
    .map((eff) => eff.value);
  const min = Math.min(...values);

  const minIndexes = [0, 1, 2, 3, 4].filter(
    (index) => state.effects[index].value === min
  );

  const pickedMin = chance.pickone(minIndexes);

  const selectedValue = state.effects[pickedMin].value;

  const partitionsArr = partition(selectedValue, 5).filter((arr, i) => {
    if (i === ui.selectedEffectIndex) {
      return arr[i] === state.effects[i].value;
    }
    if (state.effects[i].isLocked) {
      return arr[i] === state.effects[i].value;
    }
    return true;
  });

  const picked = chance.pickone(partitionsArr);

  const effects = state.effects.map((eff, index) => {
    if (eff.isLocked) {
      return eff;
    }

    return {
      ...eff,
      value: picked[index],
    };
  });

  return {
    ...state,
    effects,
  };
}

// <최고 단계> 효과 <1>개의 단계를 전부 다른 효과에 나누지. 어떻게 나뉠지 보자고.
function redistributeMaxToOthers(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const values = state.effects
    .filter((eff) => !eff.isLocked)
    .map((eff) => eff.value);
  const max = Math.max(...values);

  const maxIndexes = [0, 1, 2, 3, 4].filter(
    (index) => state.effects[index].value === max
  );

  const pickedMax = chance.pickone(maxIndexes);

  const selectedValue = state.effects[pickedMax].value;

  const partitionsArr = partition(selectedValue, 5).filter((arr, i) => {
    if (i === ui.selectedEffectIndex) {
      return arr[i] === state.effects[i].value;
    }
    if (state.effects[i].isLocked) {
      return arr[i] === state.effects[i].value;
    }
    return true;
  });

  const picked = chance.pickone(partitionsArr);

  const effects = state.effects.map((eff, index) => {
    if (eff.isLocked) {
      return eff;
    }

    return {
      ...eff,
      value: picked[index],
    };
  });

  return {
    ...state,
    effects,
  };
}

// <최고 단계> 효과 <1>개의 단계를 <1> 소모하겠다. 대신 <최고 단계> 효과 <1>개와 <최하 단계> 효과 <1>개의 단계를 뒤바꿔주지.
function decreaseMaxAndSwapMinMax(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const values = state.effects
    .filter((eff) => !eff.isLocked)
    .map((eff) => eff.value);
  const max = Math.max(...values);
  const min = Math.min(...values);

  const maxIndexes = [0, 1, 2, 3, 4].filter(
    (index) => state.effects[index].value === max
  );
  const minIndexes = [0, 1, 2, 3, 4].filter(
    (index) => state.effects[index].value === min
  );

  const pickedMax = chance.pickone(maxIndexes);
  const pickedMin = chance.pickone(minIndexes);

  const effects = state.effects.map((eff, index) => {
    if (index === pickedMax) {
      return {
        ...eff,
        value: min,
      };
    } else if (index === pickedMin) {
      return {
        ...eff,
        value: max - 1,
      };
    }

    return eff;
  });

  return {
    ...state,
    effects,
  };
}

// <{0}> 효과의 단계를 <1> 소모하겠다. 대신 <{0}> 효과와 <{1}> 효과의 단계를 뒤바꿔주지.
function decreaseFirstTargetAndSwap(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  const [target1, target2] = logic.value;

  const value1 = state.effects[target1].value;
  const value2 = state.effects[target2].value;

  const effects = state.effects.map((eff, index) => {
    if (index === target1) {
      return {
        ...eff,
        value: value2,
      };
    } else if (index === target2) {
      return {
        ...eff,
        value: value1 - 1,
      };
    }

    return eff;
  });

  return {
    ...state,
    effects,
  };
}

const logicFns: Record<
  CouncilLogicType,
  (state: GameState, ui: UiState, logic: CouncilLogicData) => GameState
> = {
  mutateProb,
  mutateLuckyRatio,
  increaseTargetWithRatio,
  increaseTargetRanged,
  decreaseTurnLeft,
  shuffleAll,
  setEnchantTargetAndAmount,
  unlockTargetAndLockOther,
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
  swapTargets,
  swapMinMax,
  exhaust,
  increaseMaxAndDecreaseTarget,
  increaseMinAndDecreaseTarget,
  redistributeMinToOthers,
  redistributeMaxToOthers,
  decreaseMaxAndSwapMinMax,
  decreaseFirstTargetAndSwap,
};

function runLogic(
  state: GameState,
  ui: UiState,
  logic: CouncilLogicData
): GameState {
  return logicFns[logic.type](state, ui, logic);
}

export default runLogic;
