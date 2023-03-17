import { cycle } from "../util";
import { pipe } from "../util/pipe";
import * as Board from "./board";
import { Context } from "./context";
import * as GameState from "./game-state";
import * as Mutation from "./mutation";

export type CouncilLogicType =
  | "mutateProb"
  | "mutateLuckyRatio"
  | "increaseTargetWithRatio"
  | "increaseTargetRanged"
  | "decreaseTurnLeft"
  | "shuffleAll"
  | "setEnchantTargetAndAmount"
  | "unsealAndSealOther"
  | "changeEffect"
  | "sealTarget"
  | "increaseReroll"
  | "decreasePrice"
  | "restart"
  | "setEnchantIncreaseAmount"
  | "setEnchantEffectCount"
  | "setValueRanged"
  | "redistributeAll"
  | "redistributeSelectedToOthers"
  | "shiftAll"
  | "swapValues"
  | "swapMinMax"
  | "exhaust"
  | "increaseMaxAndDecreaseTarget"
  | "increaseMinAndDecreaseTarget"
  | "redistributeMinToOthers"
  | "redistributeMaxToOthers"
  | "decreaseMaxAndSwapMinMax"
  | "decreaseFirstTargetAndSwap";

export type CouncilTargetType =
  | "none"
  | "random"
  | "proposed"
  | "maxValue"
  | "minValue"
  | "userSelect"
  | "lteValue"
  | "oneThreeFive"
  | "twoFour";

export interface T {
  type: CouncilLogicType;
  targetType: CouncilTargetType;
  targetCondition: number;
  targetCount: number;
  ratio: number;
  value: [number, number];
  remainTurn: number;
}

type Action = {
  logic: Omit<T, "targetType" | "targetCondition" | "targetCount">;
  targets: number[];
};

export function createReducer(ctx: Context) {
  function reducer(state: GameState.T, action: Action) {
    const { rng } = ctx;
    const { logic, targets } = action;

    const reducer = GameState.reducer;
    const boardReducer = (state: GameState.T, action: Board.Action) =>
      GameState.boardReducer(state, action, ctx);
    const boardReducerC = (action: Board.Action) => (state: GameState.T) =>
      GameState.boardReducer(state, action, ctx);
    const sageGroupReducer = GameState.sageGroupReducer;

    // 이번 연성에서 {0} 효과가 연성될 확률을 x% 올려주지.
    // 남은 모든 연성에서 {0} 효과가 연성될 확률을 x% 올려주지.
    function mutateProb(): GameState.T {
      const mutations = targets.map((index) =>
        Mutation.createProbMutation(
          index,
          logic.value[0] / 10000,
          logic.remainTurn
        )
      );

      return reducer(state, {
        type: "addMutations",
        mutations,
      });
    }

    // 이번 연성에서 {0} 효과의 대성공 확률을 x% 올려주지.
    // 남은 모든 연성에서 {0} 효과의 대성공 확률을 x% 올려주지.
    function mutateLuckyRatio(): GameState.T {
      const mutations = targets.map((index) =>
        Mutation.createLuckyRatioMutation(
          index,
          logic.value[0] / 10000,
          logic.remainTurn
        )
      );

      return reducer(state, {
        type: "addMutations",
        mutations,
      });
    }

    // <{0}> 효과의 단계를 <1> 올려보겠어. <25>% 확률로 성공하겠군.
    function increaseTargetWithRatio(): GameState.T {
      return targets.reduce((acc, index) => {
        const isSuccess = rng.bool({ likelihood: logic.ratio / 100 });
        if (isSuccess) {
          return boardReducer(acc, {
            type: "increaseValue",
            index,
            diff: logic.value[0],
          });
        }

        return acc;
      }, state);
    }

    // <{0}> 효과의 단계를 [<+1>~<+2>]만큼 올려주지.
    function increaseTargetRanged(): GameState.T {
      return targets.reduce(
        (acc, index) =>
          boardReducer(acc, {
            type: "increaseValue",
            index,
            diff: rng.integer({
              min: logic.value[0],
              max: logic.value[1],
            }),
          }),
        state
      );
    }

    // 대신 기회를 2회 소모하겠군.
    function decreaseTurnLeft(): GameState.T {
      return reducer(state, {
        type: "decreaseTurn",
        amount: logic.value[0],
      });
    }

    // <모든 효과>의 단계를 뒤섞도록 하지. 어떻게 뒤섞일지 보자고.
    function shuffleAll(): GameState.T {
      const beforeShuffle = Board.query.getUnsealedIndices(state.board);
      const afterShuffle = rng.shuffle(beforeShuffle);

      return beforeShuffle.reduce(
        (acc, index, i) =>
          boardReducer(acc, {
            type: "setValue",
            index,
            value: Board.query.getValue(state.board, afterShuffle[i]),
          }),
        state
      );
    }

    // 이번에는 <{0}> 효과를 <2>단계 연성해주지.
    function setEnchantTargetAndAmount(): GameState.T {
      const mutations = targets.flatMap<Mutation.T>((index) => [
        Mutation.createProbMutation(index, 1, logic.remainTurn),
        Mutation.createEnchantIncreaseAmountMutation(logic.value[0]),
      ]);

      return reducer(state, {
        type: "addMutations",
        mutations,
      });
    }

    // <임의의 효과> <1>개의 봉인을 해제하고, 다른 효과 <1>개를 봉인해주지.
    function unsealAndSealOther(): GameState.T {
      const sealedIndexes = Board.query.getSealedIndices(state.board);
      const unsealedIndexes = Board.query.getUnsealedIndices(state.board);

      const sealedIndex = rng.pickone(sealedIndexes);
      const unsealedIndex = rng.pickone(unsealedIndexes);

      return pipe(
        state,
        boardReducerC({
          type: "unseal",
          index: sealedIndex,
        }),
        boardReducerC({
          type: "seal",
          index: unsealedIndex,
        })
      );
    }

    // TODO: implement this
    // <네가 고르는> 슬롯의 효과를 바꿔주지. 어떤 효과일지 보자고.
    function changeEffect(): GameState.T {
      return state;
    }

    // <{0}> 효과를 봉인하겠다.
    function sealTarget(): GameState.T {
      return targets.reduce(
        (acc, index) =>
          GameState.boardReducer(acc, { type: "seal", index }, ctx),
        state
      );
    }

    // 조언이 더 필요한가? 다른 조언 보기 횟수를 <2>회 늘려주지.
    function increaseReroll(): GameState.T {
      return GameState.reducer(state, {
        type: "increaseRerollLeft",
        amount: logic.value[0],
      });
    }

    // 남은 모든 연성에서 비용이 <20%> 덜 들겠어.
    function decreasePrice(): GameState.T {
      return state;
    }

    // 이대론 안되겠어. 엘릭서의 효과와 단계를 <초기화>하겠다.
    function restart(): GameState.T {
      return reducer(state, {
        type: "markAsRestart",
      });
    }

    // 이번에 연성되는 효과는 <2>단계 올라갈거야.
    function setEnchantIncreaseAmount(): GameState.T {
      return reducer(state, {
        type: "addMutations",
        mutations: [
          Mutation.createEnchantIncreaseAmountMutation(logic.value[0]),
        ],
      });
    }

    // 이번에는 <2>개의 효과를 동시에 연성하겠어.
    function setEnchantEffectCount(): GameState.T {
      return reducer(state, {
        type: "addMutations",
        mutations: [Mutation.createEnchantEffectCountMutation(logic.value[0])],
      });
    }

    // <{0}> 효과의 단계를 [<1>~<2>] 중 하나로 바꿔주지.
    function setValueRanged(): GameState.T {
      return targets.reduce((acc, index) => {
        const value = rng.integer({
          min: logic.value[0],
          max: logic.value[1],
        });
        return boardReducer(state, {
          type: "setValue",
          index,
          value,
        });
      }, state);
    }

    // <모든 효과>의 단계를 재분배하지. 어떻게 나뉠지 보자고.
    function redistributeAll(): GameState.T {
      const totalValue = Board.query.getTotalUnsealedValue(state.board);
      const availableIndexes = Board.query.getUnsealedIndices(state.board);
      const values = [0, 1, 2, 3, 4].map((index) =>
        Board.query.isIndexSealed(state.board, index)
          ? Board.query.getValue(state.board, index)
          : 0
      );

      for (let i = 0; i < totalValue; i++) {
        const index = rng.pickone(availableIndexes);
        values[index]++;
      }

      return boardReducer(state, {
        type: "setValues",
        values,
      });
    }

    // <네가 고르는> 효과의 단계를 전부 다른 효과에 나누지. 어떻게 나뉠지 보자고.
    function redistributeSelectedToOthers(): GameState.T {
      const target = targets[0];
      const selectedValue = Board.query.getValue(state.board, target);
      const availableIndexes = Board.query
        .getUnsealedIndices(state.board)
        .filter((index) => index !== target);
      const values = [0, 1, 2, 3, 4].map((index) =>
        index !== target ? Board.query.getValue(state.board, index) : 0
      );

      for (let i = 0; i < selectedValue; i++) {
        const index = rng.pickone(availableIndexes);
        values[index]++;
      }

      return boardReducer(state, {
        type: "setValues",
        values,
      });
    }

    // <모든 효과>의 단계를 위로 <1> 슬롯 씩 옮겨주겠어.
    function shiftAll(): GameState.T {
      const values = Board.query.getValues(state.board);
      const direction = logic.value[0] as 0 | 1; // 0=up, 1=down
      const shiftedValues: number[] = [];

      for (let i = 0; i < 5; i++) {
        if (Board.query.isIndexSealed(state.board, i)) {
          shiftedValues[i] = values[i];
        }

        let j = i;
        do {
          j = cycle(j, 5, direction);
        } while (Board.query.isIndexSealed(state.board, j));

        shiftedValues[j] = values[i];
      }

      return boardReducer(state, {
        type: "setValues",
        values: shiftedValues,
      });
    }

    // <{0}> 효과와 <{1}> 효과의 단계를 뒤바꿔줄게.
    function swapValues(): GameState.T {
      const [target1, target2] = logic.value;
      const value1 = Board.query.getValue(state.board, target1);
      const value2 = Board.query.getValue(state.board, target2);

      return pipe(
        state,
        boardReducerC({
          type: "setValue",
          index: target1,
          value: value2,
        }),
        boardReducerC({
          type: "setValue",
          index: target2,
          value: value1,
        })
      );
    }

    // <최고 단계> 효과 <1>개와  <최하 단계> 효과 <1>개의 단계를 뒤바꿔주지.
    function swapMinMax(): GameState.T {
      const [max, maxIndices] = Board.query.getUnsealedMaxValueIndices(
        state.board
      );
      const [min, minIndices] = Board.query.getUnsealedMinValueIndices(
        state.board
      );
      const pickedMax = rng.pickone(maxIndices);
      const pickedMin = rng.pickone(minIndices);

      return pipe(
        state,
        boardReducerC({
          type: "setValue",
          index: pickedMax,
          value: min,
        }),
        boardReducerC({
          type: "setValue",
          index: pickedMin,
          value: max,
        })
      );
    }

    // 소진
    function exhaust(): GameState.T {
      const sageIndex = logic.value[0] - 1;
      return sageGroupReducer(state, { type: "exhaust", index: sageIndex });
    }

    // <최고 단계> 효과 <1>개의 단계를 <1> 올려주지. 하지만 <최하 단계> 효과 <1>개의 단계는 <1> 내려갈 거야.
    function increaseMaxAndDecreaseTarget(): GameState.T {
      const [_max, maxIndices] = Board.query.getUnsealedMaxValueIndices(
        state.board
      );
      const pickedMax = rng.pickone(maxIndices);

      const increasedState = boardReducer(state, {
        type: "increaseValue",
        index: pickedMax,
        diff: logic.value[0],
      });

      return targets.reduce(
        (acc, index) =>
          boardReducer(acc, {
            type: "increaseValue",
            index,
            diff: logic.value[1],
          }),
        increasedState
      );
    }

    // <최하 단계> 효과 <1>개의 단계를 <2> 올려주지. 하지만 <최고 단계> 효과 <1>개의 단계는 <2> 내려갈 거야.
    function increaseMinAndDecreaseTarget(): GameState.T {
      const [_min, minIndices] = Board.query.getUnsealedMinValueIndices(
        state.board
      );
      const pickedMin = rng.pickone(minIndices);

      const increasedState = boardReducer(state, {
        type: "increaseValue",
        index: pickedMin,
        diff: logic.value[0],
      });

      return targets.reduce(
        (acc, index) =>
          boardReducer(acc, {
            type: "increaseValue",
            index,
            diff: logic.value[1],
          }),
        increasedState
      );
    }

    // <최하 단계> 효과 <1>개의 단계를 전부 다른 효과에 나누지. 어떻게 나뉠지 보자고.
    function redistributeMinToOthers(): GameState.T {
      const [minValue, minIndices] = Board.query.getUnsealedMinValueIndices(
        state.board
      );
      const pickedMin = rng.pickone(minIndices);
      const availableIndexes = Board.query
        .getSealedIndices(state.board)
        .filter((index) => index !== pickedMin);
      const values = [0, 1, 2, 3, 4].map((index) =>
        index !== pickedMin ? Board.query.getValue(state.board, index) : 0
      );

      for (let i = 0; i < minValue; i++) {
        const index = rng.pickone(availableIndexes);
        values[index]++;
      }

      return boardReducer(state, {
        type: "setValues",
        values,
      });
    }

    // <최고 단계> 효과 <1>개의 단계를 전부 다른 효과에 나누지. 어떻게 나뉠지 보자고.
    function redistributeMaxToOthers(): GameState.T {
      const [maxValue, maxIndices] = Board.query.getUnsealedMaxValueIndices(
        state.board
      );
      const pickedMax = rng.pickone(maxIndices);
      const availableIndices = Board.query
        .getUnsealedIndices(state.board)
        .filter((index) => index !== pickedMax);
      const values = [0, 1, 2, 3, 4].map((index) =>
        index !== pickedMax ? Board.query.getValue(state.board, index) : 0
      );

      for (let i = 0; i < maxValue; i++) {
        const index = rng.pickone(availableIndices);
        values[index]++;
      }

      return boardReducer(state, {
        type: "setValues",
        values,
      });
    }

    // <최고 단계> 효과 <1>개의 단계를 <1> 소모하겠다. 대신 <최고 단계> 효과 <1>개와 <최하 단계> 효과 <1>개의 단계를 뒤바꿔주지.
    function decreaseMaxAndSwapMinMax(): GameState.T {
      const [max, maxIndices] = Board.query.getUnsealedMaxValueIndices(
        state.board
      );
      const [min, minIndices] = Board.query.getUnsealedMinValueIndices(
        state.board
      );
      const pickedMax = rng.pickone(maxIndices);
      const pickedMin = rng.pickone(minIndices);

      return pipe(
        state,
        boardReducerC({
          type: "setValue",
          index: pickedMax,
          value: min,
        }),
        boardReducerC({
          type: "setValue",
          index: pickedMin,
          value: max - 1,
        })
      );
    }

    // <{0}> 효과의 단계를 <1> 소모하겠다. 대신 <{0}> 효과와 <{1}> 효과의 단계를 뒤바꿔주지.
    function decreaseFirstTargetAndSwap(): GameState.T {
      const [target1, target2] = logic.value;

      const value1 = Board.query.getValue(state.board, target1);
      const value2 = Board.query.getValue(state.board, target2);

      return pipe(
        state,
        boardReducerC({
          type: "setValue",
          index: target1,
          value: value2,
        }),
        boardReducerC({
          type: "setValue",
          index: target2,
          value: value1 - 1,
        })
      );
    }

    const logicFns: Record<CouncilLogicType, () => GameState.T> = {
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

    return logicFns[action.logic.type]();
  }

  return reducer;
}
