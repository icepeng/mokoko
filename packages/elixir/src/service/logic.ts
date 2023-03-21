import { CouncilLogic, CouncilLogicType } from "../model/council";
import { GameState } from "../model/game";
import { Mutation } from "../model/mutation";
import { cycle } from "../util";
import { EffectService } from "./effect";
import { RngService } from "./rng";

export function createLogicService(
  chance: RngService,
  effectService: EffectService
) {
  // 이번 연성에서 {0} 효과가 연성될 확률을 x% 올려주지.
  // 남은 모든 연성에서 {0} 효과가 연성될 확률을 x% 올려주지.
  function mutateProb(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const mutations = targets.map((index) =>
      Mutation.createProbMutation(
        index,
        logic.value[0] / 10000,
        logic.remainTurn
      )
    );

    return GameState.addMutations(state, mutations);
  }

  // 이번 연성에서 {0} 효과의 대성공 확률을 x% 올려주지.
  // 남은 모든 연성에서 {0} 효과의 대성공 확률을 x% 올려주지.
  function mutateLuckyRatio(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const mutations = targets.map((index) =>
      Mutation.createLuckyRatioMutation(
        index,
        logic.value[0] / 10000,
        logic.remainTurn
      )
    );

    return GameState.addMutations(state, mutations);
  }

  // <{0}> 효과의 단계를 <1> 올려보겠어. <25>% 확률로 성공하겠군.
  function increaseTargetWithRatio(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    return targets.reduce((acc, index) => {
      const isSuccess = chance.bool({ likelihood: logic.ratio / 100 });
      if (isSuccess) {
        return GameState.increaseEffectValue(acc, index, logic.value[0]);
      }

      return acc;
    }, state);
  }

  // <{0}> 효과의 단계를 [<+1>~<+2>]만큼 올려주지.
  function increaseTargetRanged(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    return targets.reduce((acc, index) => {
      const diff = chance.integer({
        min: logic.value[0],
        max: logic.value[1],
      });
      return GameState.increaseEffectValue(acc, index, diff);
    }, state);
  }

  // 대신 기회를 2회 소모하겠군.
  function decreaseTurnLeft(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    return GameState.decreaseTurn(state, logic.value[0]);
  }

  // <모든 효과>의 단계를 뒤섞도록 하지. 어떻게 뒤섞일지 보자고.
  function shuffleAll(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const beforeShuffle = [0, 1, 2, 3, 4].filter(
      (index) => !GameState.query.isEffectSealed(state, index)
    );
    const afterShuffle = chance.shuffle(beforeShuffle);

    return beforeShuffle.reduce(
      (acc, index, i) =>
        GameState.setEffectValue(
          acc,
          index,
          GameState.query.getEffectValue(state, afterShuffle[i])
        ),
      state
    );
  }

  // 이번에는 <{0}> 효과를 <2>단계 연성해주지.
  function setEnchantTargetAndAmount(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const mutations = targets.flatMap<Mutation>((index) => [
      Mutation.createProbMutation(index, 1, logic.remainTurn),
      Mutation.createEnchantIncreaseAmountMutation(logic.value[0]),
    ]);

    return GameState.addMutations(state, mutations);
  }

  // <임의의 효과> <1>개의 봉인을 해제하고, 다른 효과 <1>개를 봉인해주지.
  function unsealAndSealOther(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const sealedIndexes = [0, 1, 2, 3, 4].filter((index) =>
      GameState.query.isEffectSealed(state, index)
    );
    const unsealedIndexes = [0, 1, 2, 3, 4].filter(
      (index) => !GameState.query.isEffectSealed(state, index)
    );

    const sealedIndex = chance.pickone(sealedIndexes);
    const unsealedIndex = chance.pickone(unsealedIndexes);

    return GameState.sealEffect(
      GameState.unsealEffect(state, sealedIndex),
      unsealedIndex
    );
  }

  // TODO: implement this
  // <네가 고르는> 슬롯의 효과를 바꿔주지. 어떤 효과일지 보자고.
  function changeEffect(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    return state;
  }

  // <{0}> 효과를 봉인하겠다.
  function sealTarget(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    return targets.reduce(
      (acc, index) => GameState.sealEffect(acc, index),
      state
    );
  }

  // 조언이 더 필요한가? 다른 조언 보기 횟수를 <2>회 늘려주지.
  function increaseReroll(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    return GameState.increaseRerollLeft(state, logic.value[0]);
  }

  // 남은 모든 연성에서 비용이 <20%> 덜 들겠어.
  function decreasePrice(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    return state;
  }

  // 이대론 안되겠어. 엘릭서의 효과와 단계를 <초기화>하겠다.
  function restart(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    return GameState.markAsRestart(state);
  }

  // 이번에 연성되는 효과는 <2>단계 올라갈거야.
  function setEnchantIncreaseAmount(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    return GameState.addMutations(state, [
      Mutation.createEnchantIncreaseAmountMutation(logic.value[0]),
    ]);
  }

  // 이번에는 <2>개의 효과를 동시에 연성하겠어.
  function setEnchantEffectCount(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    return GameState.addMutations(state, [
      Mutation.createEnchantEffectCountMutation(logic.value[0]),
    ]);
  }

  // <{0}> 효과의 단계를 [<1>~<2>] 중 하나로 바꿔주지.
  function setValueRanged(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    return targets.reduce((acc, index) => {
      const value = chance.integer({
        min: logic.value[0],
        max: logic.value[1],
      });
      return GameState.setEffectValue(acc, index, value);
    }, state);
  }

  // <모든 효과>의 단계를 재분배하지. 어떻게 나뉠지 보자고.
  function redistributeAll(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const values = [0, 1, 2, 3, 4].map((index) =>
      GameState.query.getEffectValue(state, index)
    );
    const fixedIndices = [0, 1, 2, 3, 4].filter((index) =>
      GameState.query.isEffectSealed(state, index)
    );

    const redistributed = chance.redistributeAll({
      values,
      fixedIndices,
      limit: state.config.maxEnchant,
    });

    return GameState.setEffectValueAll(state, redistributed);
  }

  // <네가 고르는> 효과의 단계를 전부 다른 효과에 나누지. 어떻게 나뉠지 보자고.
  function redistributeSelectedToOthers(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const target = targets[0];
    const values = [0, 1, 2, 3, 4].map((index) =>
      GameState.query.getEffectValue(state, index)
    );
    const fixedIndices = [0, 1, 2, 3, 4].filter((index) =>
      GameState.query.isEffectSealed(state, index)
    );

    const redistributed = chance.redistributeOne({
      values,
      indexToRedistribute: target,
      fixedIndices,
      limit: state.config.maxEnchant,
    });

    return GameState.setEffectValueAll(state, redistributed);
  }

  // <모든 효과>의 단계를 위로 <1> 슬롯 씩 옮겨주겠어.
  function shiftAll(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const values = state.effects.map((eff) => eff.value);
    const direction = logic.value[0] as 0 | 1; // 0=up, 1=down
    const shiftedValues: number[] = [];

    for (let i = 0; i < 5; i++) {
      if (GameState.query.isEffectSealed(state, i)) {
        shiftedValues[i] = values[i];
      }

      let j = i;
      do {
        j = cycle(j, 5, direction);
      } while (GameState.query.isEffectSealed(state, j));

      shiftedValues[j] = values[i];
    }

    return GameState.setEffectValueAll(state, shiftedValues);
  }

  // <{0}> 효과와 <{1}> 효과의 단계를 뒤바꿔줄게.
  function swapValues(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const [target1, target2] = logic.value;
    const value1 = GameState.query.getEffectValue(state, target1);
    const value2 = GameState.query.getEffectValue(state, target2);

    return GameState.setEffectValue(
      GameState.setEffectValue(state, target1, value2),
      target2,
      value1
    );
  }

  // <최고 단계> 효과 <1>개와  <최하 단계> 효과 <1>개의 단계를 뒤바꿔주지.
  function swapMinMax(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const [max, pickedMax] = effectService.pickMaxValueIndex(state.effects);
    const [min, pickedMin] = effectService.pickMinValueIndex(state.effects);

    return GameState.setEffectValue(
      GameState.setEffectValue(state, pickedMax, min),
      pickedMin,
      max
    );
  }

  // 소진
  function exhaust(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const sageIndex = logic.value[0] - 1;
    return GameState.exhaustSage(state, sageIndex);
  }

  // <최고 단계> 효과 <1>개의 단계를 <1> 올려주지. 하지만 <최하 단계> 효과 <1>개의 단계는 <1> 내려갈 거야.
  function increaseMaxAndDecreaseTarget(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const [_, pickedMax] = effectService.pickMaxValueIndex(state.effects);

    const increasedState = GameState.increaseEffectValue(
      state,
      pickedMax,
      logic.value[0]
    );
    return targets.reduce(
      (acc, index) => GameState.increaseEffectValue(acc, index, logic.value[1]),
      increasedState
    );
  }

  // <최하 단계> 효과 <1>개의 단계를 <2> 올려주지. 하지만 <최고 단계> 효과 <1>개의 단계는 <2> 내려갈 거야.
  function increaseMinAndDecreaseTarget(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const [_, pickedMin] = effectService.pickMinValueIndex(state.effects);

    const increasedState = GameState.increaseEffectValue(
      state,
      pickedMin,
      logic.value[0]
    );
    return targets.reduce(
      (acc, index) => GameState.increaseEffectValue(acc, index, logic.value[1]),
      increasedState
    );
  }

  // <최하 단계> 효과 <1>개의 단계를 전부 다른 효과에 나누지. 어떻게 나뉠지 보자고.
  function redistributeMinToOthers(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const [_, pickedMin] = effectService.pickMinValueIndex(state.effects);
    const values = [0, 1, 2, 3, 4].map((index) =>
      GameState.query.getEffectValue(state, index)
    );
    const fixedIndices = [0, 1, 2, 3, 4].filter((index) =>
      GameState.query.isEffectSealed(state, index)
    );

    const redistributed = chance.redistributeOne({
      values,
      indexToRedistribute: pickedMin,
      fixedIndices,
      limit: state.config.maxEnchant,
    });

    return GameState.setEffectValueAll(state, redistributed);
  }

  // <최고 단계> 효과 <1>개의 단계를 전부 다른 효과에 나누지. 어떻게 나뉠지 보자고.
  function redistributeMaxToOthers(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const [_, pickedMax] = effectService.pickMaxValueIndex(state.effects);
    const values = [0, 1, 2, 3, 4].map((index) =>
      GameState.query.getEffectValue(state, index)
    );
    const fixedIndices = [0, 1, 2, 3, 4].filter((index) =>
      GameState.query.isEffectSealed(state, index)
    );

    const redistributed = chance.redistributeOne({
      values,
      indexToRedistribute: pickedMax,
      fixedIndices,
      limit: state.config.maxEnchant,
    });

    return GameState.setEffectValueAll(state, redistributed);
  }

  // <최고 단계> 효과 <1>개의 단계를 <1> 소모하겠다. 대신 <최고 단계> 효과 <1>개와 <최하 단계> 효과 <1>개의 단계를 뒤바꿔주지.
  function decreaseMaxAndSwapMinMax(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const [max, pickedMax] = effectService.pickMaxValueIndex(state.effects);
    const [min, pickedMin] = effectService.pickMinValueIndex(state.effects);

    return GameState.setEffectValue(
      GameState.setEffectValue(state, pickedMax, min),
      pickedMin,
      max - 1
    );
  }

  // <{0}> 효과의 단계를 <1> 소모하겠다. 대신 <{0}> 효과와 <{1}> 효과의 단계를 뒤바꿔주지.
  function decreaseFirstTargetAndSwap(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    const [target1, target2] = logic.value;

    const value1 = GameState.query.getEffectValue(state, target1);
    const value2 = GameState.query.getEffectValue(state, target2);

    return GameState.setEffectValue(
      GameState.setEffectValue(state, target1, value2),
      target2,
      value1 - 1
    );
  }

  const logicFns: Record<
    CouncilLogicType,
    (state: GameState, logic: CouncilLogic, targets: number[]) => GameState
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

  function runLogic(
    state: GameState,
    logic: CouncilLogic,
    targets: number[]
  ): GameState {
    return logicFns[logic.type](state, logic, targets);
  }

  return {
    runLogic,
  };
}

export type LogicService = ReturnType<typeof createLogicService>;
