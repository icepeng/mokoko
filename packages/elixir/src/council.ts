import {
  isChaosFull,
  isCommonCouncilAvailable,
  isLawfulFull,
} from "./council-guards";
import { isEffectMutable } from "./effect";
import {
  Council,
  EffectProbMutation,
  EffectState,
  GameState,
} from "./interface";
import chance from "./rng";
import { and, clamp } from "./util";

const updateAllEffects = (
  fn: (effect: EffectState, maxEnchant: number) => EffectState
) => {
  return (state: GameState, _: number) => {
    const effects = state.effects.map((eff) => {
      return fn(eff, state.config.maxEnchant);
    });

    return { ...state, effects };
  };
};

const updateSelectedEffect = (
  fn: (effect: EffectState, maxEnchant: number) => EffectState
) => {
  return (state: GameState, _sageIndex: number, effectIndex?: number) => {
    if (effectIndex == null) {
      throw new Error("Effect index is not provided");
    }

    const effects = state.effects.map((eff, index) => {
      if (index === effectIndex) {
        return fn(eff, state.config.maxEnchant);
      }
      return eff;
    });

    return { ...state, effects };
  };
};

const updateProposedEffect = (
  fn: (effect: EffectState, maxEnchant: number) => EffectState,
  fn2?: (effect: EffectState, maxEnchant: number) => EffectState
) => {
  return (state: GameState, sageIndex: number) => {
    const sage = state.sages[sageIndex];
    const effectIndex = sage.effectIndex;
    const effectIndex2 = sage.effectIndex2;
    const effects = state.effects.map((eff, index) => {
      if (index === effectIndex) {
        return fn(eff, state.config.maxEnchant);
      }
      if (index === effectIndex2) {
        return fn2 ? fn2(eff, state.config.maxEnchant) : eff;
      }
      return eff;
    });

    return { ...state, effects };
  };
};

const pushSelectedMutation = (
  fn: (effectIndex: number) => EffectProbMutation
) => {
  return (state: GameState, _sageIndex: number, effectIndex?: number) => {
    if (effectIndex == null) {
      throw new Error("Effect index is not provided");
    }

    return {
      ...state,
      effectProbMutations: [...state.effectProbMutations, fn(effectIndex)],
    };
  };
};

const pushProposedMutation = (
  fn: (effectIndex: number) => EffectProbMutation
) => {
  return (state: GameState, sageIndex: number) => {
    const sage = state.sages[sageIndex];
    const effectIndex = sage.effectIndex!;

    return {
      ...state,
      effectProbMutations: [...state.effectProbMutations, fn(effectIndex)],
    };
  };
};

const exhaustSage = (state: GameState, sageIndex: number) => {
  const sages = state.sages.map((sage, index) => {
    if (index === sageIndex) {
      return { ...sage, isRemoved: true };
    }
    return sage;
  });

  return { ...state, sages };
};

export const commonCouncils: Council[] = [
  {
    id: "proposed_pair_p1_n2",
    condition: isCommonCouncilAvailable,
    description: (effectName, effect2Name) =>
      `${effectName} +1, ${effect2Name} -2`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onCouncil: updateProposedEffect(
      (effect, maxEnchant) => {
        return {
          ...effect,
          value: clamp(effect.value + 1, maxEnchant),
        };
      },
      (effect, maxEnchant) => {
        return {
          ...effect,
          value: clamp(effect.value - 2, maxEnchant),
        };
      }
    ),
  },
  // {
  //   id: "proposed_min_p1_max_n1",
  //   condition: isCommonCouncilAvailable,
  //   description: () => `최하 단계 효과 +1, 최고 단계 효과 -1`,
  //   weight: 1,
  //   isEffectAvailable: isEffectMutable,
  //   onCouncil: updateProposedEffect(),
  // },
  {
    id: "proposed_set_1_2",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `${effectName} 을 [1~2]로 변경`,
    weight: 1,
    isEffectAvailable: and(isEffectMutable, (eff) => eff.value < 2),
    onCouncil: updateProposedEffect((effect, maxEnchant) => {
      const result = chance.integer({ min: 1, max: 2 });
      return {
        ...effect,
        value: clamp(result, maxEnchant),
      };
    }),
  },
  {
    id: "proposed_set_2_3",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `${effectName} 을 [2~3]로 변경`,
    weight: 1,
    isEffectAvailable: and(isEffectMutable, (eff) => eff.value < 3),
    onCouncil: updateProposedEffect((effect, maxEnchant) => {
      const result = chance.integer({ min: 2, max: 3 });
      return {
        ...effect,
        value: clamp(result, maxEnchant),
      };
    }),
  },
  {
    id: "proposed_n1_p2",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `${effectName} [-1~+2]`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onCouncil: updateProposedEffect((effect, maxEnchant) => {
      const diff = chance.integer({ min: -1, max: 2 });
      return {
        ...effect,
        value: clamp(effect.value + diff, maxEnchant),
      };
    }),
  },
  {
    id: "proposed_n2_p2",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `${effectName} [-2~+2]`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onCouncil: updateProposedEffect((effect, maxEnchant) => {
      const diff = chance.integer({ min: -2, max: 2 });
      return {
        ...effect,
        value: clamp(effect.value + diff, maxEnchant),
      };
    }),
  },
  {
    id: "selected_n1_p2",
    condition: isCommonCouncilAvailable,
    description: () => `선택한 효과 [-1~+2]`,
    weight: 1,
    onCouncil: updateSelectedEffect((effect, maxEnchant) => {
      const diff = chance.integer({ min: -1, max: 2 });
      return {
        ...effect,
        value: clamp(effect.value + diff, maxEnchant),
      };
    }),
  },
  {
    id: "selected_n2_p2",
    condition: isCommonCouncilAvailable,
    description: () => `선택한 효과 [-2~+2]`,
    weight: 1,
    onCouncil: updateSelectedEffect((effect, maxEnchant) => {
      const diff = chance.integer({ min: -2, max: 2 });
      return {
        ...effect,
        value: clamp(effect.value + diff, maxEnchant),
      };
    }),
  },
  {
    id: "proposed_p1_25",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `25% 확률로 ${effectName} +1`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onCouncil: updateProposedEffect((effect, maxEnchant) => {
      const diff = chance.bool({ likelihood: 25 }) ? 1 : 0;
      return {
        ...effect,
        value: clamp(effect.value + diff, maxEnchant),
      };
    }),
  },
  {
    id: "proposed_p1_50",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `50% 확률로 ${effectName} +1`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onCouncil: updateProposedEffect((effect, maxEnchant) => {
      const diff = chance.bool({ likelihood: 50 }) ? 1 : 0;
      return {
        ...effect,
        value: clamp(effect.value + diff, maxEnchant),
      };
    }),
  },
  {
    id: "proposed_p1_100",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `100% 확률로 ${effectName} +1`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onCouncil: updateProposedEffect((effect, maxEnchant) => {
      const diff = chance.bool({ likelihood: 100 }) ? 1 : 0;
      return {
        ...effect,
        value: clamp(effect.value + diff, maxEnchant),
      };
    }),
  },
  {
    id: "selected_p1_25",
    condition: isCommonCouncilAvailable,
    description: () => `25% 확률로 선택한 효과 +1`,
    weight: 1,
    onCouncil: updateSelectedEffect((effect, maxEnchant) => {
      const diff = chance.bool({ likelihood: 25 }) ? 1 : 0;
      return {
        ...effect,
        value: clamp(effect.value + diff, maxEnchant),
      };
    }),
  },
  {
    id: "selected_p1_50",
    condition: isCommonCouncilAvailable,
    description: () => `50% 확률로 선택한 효과 +1`,
    weight: 1,
    onCouncil: updateSelectedEffect((effect, maxEnchant) => {
      const diff = chance.bool({ likelihood: 50 }) ? 1 : 0;
      return {
        ...effect,
        value: clamp(effect.value + diff, maxEnchant),
      };
    }),
  },
  {
    id: "selected_p1_100",
    condition: isCommonCouncilAvailable,
    description: () => `100% 확률로 선택한 효과 +1`,
    weight: 1,
    onCouncil: updateSelectedEffect((effect, maxEnchant) => {
      const diff = chance.bool({ likelihood: 100 }) ? 1 : 0;
      return {
        ...effect,
        value: clamp(effect.value + diff, maxEnchant),
      };
    }),
  },
  {
    id: "proposed_p2_turn2",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `${effectName} +2 기회 2회 소모`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onCouncil: (state, sageIndex) => {
      const updater = updateProposedEffect((effect, maxEnchant) => {
        const diff = 2;
        return {
          ...effect,
          value: clamp(effect.value + diff, maxEnchant),
        };
      });

      const updatedState = updater(state, sageIndex);
      return {
        ...updatedState,
        turnLeft: updatedState.turnLeft - 1,
      };
    },
  },

  // 이번 연성
  {
    id: "once_all_lucky_60",
    condition: isCommonCouncilAvailable,
    description: () => `이번 연성 모든 효과 대성공 확률 +60%`,
    weight: 1,
    onEnchant: updateAllEffects((effect) => {
      return {
        ...effect,
        luckyRate: clamp(effect.luckyRate + 0.6, 1),
      };
    }),
  },
  {
    id: "once_all_lucky_30",
    condition: isCommonCouncilAvailable,
    description: () => `이번 연성 모든 효과 대성공 확률 +30%`,
    weight: 1,
    onEnchant: updateAllEffects((effect) => {
      return {
        ...effect,
        luckyRate: clamp(effect.luckyRate + 0.3, 1),
      };
    }),
  },
  {
    id: "once_proposed_lucky_100",
    condition: isCommonCouncilAvailable,
    description: (effectName) =>
      `이번 연성 ${effectName} 효과 대성공 확률 +100%`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onEnchant: updateProposedEffect((effect) => {
      return {
        ...effect,
        luckyRate: clamp(effect.luckyRate + 1, 1),
      };
    }),
  },
  {
    id: "once_proposed_prob_p35",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `이번 연성 ${effectName} 효과 확률 +35%`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onEnchant: pushProposedMutation((index) => ({ diff: 0.35, index })),
  },
  {
    id: "once_proposed_prob_p70",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `이번 연성 ${effectName} 효과 확률 +70%`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onEnchant: pushProposedMutation((index) => ({ diff: 0.7, index })),
  },
  {
    id: "once_proposed_prob_p100",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `이번 연성 ${effectName} 효과 확률 +100%`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onEnchant: pushProposedMutation((index) => ({ diff: 1, index })),
  },
  {
    id: "once_proposed_prob_n20",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `이번 연성 ${effectName} 효과 확률 -20%`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onEnchant: pushProposedMutation((index) => ({ diff: -0.2, index })),
  },
  {
    id: "once_proposed_prob_n40",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `이번 연성 ${effectName} 효과 확률 -40%`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onEnchant: pushProposedMutation((index) => ({ diff: -0.4, index })),
  },
  {
    id: "once_selected_prob_p35",
    condition: isCommonCouncilAvailable,
    description: () => `이번 연성 선택한 효과 확률 +35%`,
    weight: 1,
    onEnchant: pushSelectedMutation((index) => ({ diff: 0.35, index })),
  },
  {
    id: "once_selected_prob_p70",
    condition: isCommonCouncilAvailable,
    description: () => `이번 연성 선택한 효과 확률 +70%`,
    weight: 1,
    onEnchant: pushSelectedMutation((index) => ({ diff: 0.7, index })),
  },
  {
    id: "once_selected_prob_p100",
    condition: isCommonCouncilAvailable,
    description: () => `이번 연성 선택한 효과 확률 +100%`,
    weight: 1,
    onEnchant: pushSelectedMutation((index) => ({ diff: 1, index })),
  },
  {
    id: "once_selected_prob_n20",
    condition: isCommonCouncilAvailable,
    description: () => `이번 연성 선택한 효과 확률 -20%`,
    weight: 1,
    onEnchant: pushSelectedMutation((index) => ({ diff: -0.2, index })),
  },
  {
    id: "once_selected_prob_n40",
    condition: isCommonCouncilAvailable,
    description: () => `이번 연성 선택한 효과 확률 -40%`,
    weight: 1,
    onEnchant: pushSelectedMutation((index) => ({ diff: -0.4, index })),
  },
  {
    id: "once_enchant_increase_2",
    condition: isCommonCouncilAvailable,
    description: () => `이번 연성은 2단계 증가`,
    weight: 1,
    onEnchant: (state) => ({ ...state, enchantIncreaseAmount: 2 }),
  },
  {
    id: "once_enchant_three_penalty",
    condition: isCommonCouncilAvailable,
    description: () => `이번 연성은 3개 효과 동시에 연성, 기회 2회 소모`,
    weight: 1,
    onCouncil: (state) => ({ ...state, turnLeft: state.turnLeft - 1 }),
    onEnchant: (state) => ({ ...state, enchantEffectCount: 3 }),
  },

  // 남은 모든 연성
  {
    id: "proposed_prob_n10",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `남은 모든 연성 ${effectName} 확률 -10%`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onCouncil: pushProposedMutation((index) => ({ diff: -0.1, index })),
  },
  {
    id: "proposed_prob_n5",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `남은 모든 연성 ${effectName} 확률 -5%`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onCouncil: pushProposedMutation((index) => ({ diff: -0.05, index })),
  },
  {
    id: "proposed_prob_p10",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `남은 모든 연성 ${effectName} 확률 +10%`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onCouncil: pushProposedMutation((index) => ({ diff: 0.1, index })),
  },
  {
    id: "proposed_prob_p5",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `남은 모든 연성 ${effectName} 확률 +5%`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onCouncil: pushProposedMutation((index) => ({ diff: 0.05, index })),
  },
  {
    id: "all_lucky_p10",
    condition: isCommonCouncilAvailable,
    description: (_) => `남은 모든 연성 모든 효과 대성공 확률 +10%`,
    weight: 1,
    onCouncil: updateAllEffects((effect) => {
      return {
        ...effect,
        luckyRate: clamp(effect.luckyRate + 0.1, 1),
      };
    }),
  },
  {
    id: "all_lucky_p5",
    condition: isCommonCouncilAvailable,
    description: (_) => `남은 모든 연성 모든 효과 대성공 확률 +5%`,
    weight: 1,
    onCouncil: updateAllEffects((effect) => {
      return {
        ...effect,
        luckyRate: clamp(effect.luckyRate + 0.05, 1),
      };
    }),
  },
  {
    id: "proposed_lucky_p15",
    condition: isCommonCouncilAvailable,
    description: (effectName) =>
      `남은 모든 연성 ${effectName} 대성공 확률 +15%`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onCouncil: updateProposedEffect((effect, _) => {
      return {
        ...effect,
        luckyRate: clamp(effect.luckyRate + 0.15, 1),
      };
    }),
  },
  {
    id: "proposed_lucky_p7",
    condition: isCommonCouncilAvailable,
    description: (effectName) => `남은 모든 연성 ${effectName} 대성공 확률 +7%`,
    weight: 1,
    isEffectAvailable: isEffectMutable,
    onCouncil: updateProposedEffect((effect, _) => {
      return {
        ...effect,
        luckyRate: clamp(effect.luckyRate + 0.07, 1),
      };
    }),
  },
];

export const chaosCouncils: Council[] = [
  {
    id: "chaos_proposed_n4_p5_exhaust",
    condition: isChaosFull,
    description: (effectName) => `${effectName} [-4~+5], 소진`,
    weight: 1,
    onCouncil: (state, sageIndex) => {
      const updater = updateProposedEffect((effect, maxEnchant) => {
        const diff = chance.integer({ min: -4, max: 5 });
        return {
          ...effect,
          value: clamp(effect.value + diff, maxEnchant),
        };
      });

      const updatedState = updater(state, sageIndex);
      return exhaustSage(updatedState, sageIndex);
    },
  },
];

export const lawfulCouncils: Council[] = [
  {
    id: "enchant_no_turn",
    condition: isLawfulFull,
    description: () => "이번 연성은 기회 소모 없음",
    weight: 1,
    onCouncil: (state, _) => {
      return {
        ...state,
        turnLeft: state.turnLeft + 1,
      };
    },
  },
];

export const councils = [
  ...commonCouncils,
  ...chaosCouncils,
  ...lawfulCouncils,
];

export const councilRecord: Record<string, Council> = Object.fromEntries(
  councils.map((council) => [council.id, council])
);

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
