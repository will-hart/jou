import { Deck, ICardDefinition, IEffectDefinition } from '@jou/common'

import { EffectType } from './effectDefinitions'

export enum CardAffinity {
  ATTACK = 'attack',
  EFFECT_SELF = 'effect_self',
  RETARGET_ATTACK = 'retarget_attack',
}

const getImagePath = (name: string) =>
  `https://bythesword-cards.s3-ap-southeast-2.amazonaws.com/${name}.png`

const generateCards = (
  count: number,
  cardGenerator: (idx: number) => ICardDefinition
): ICardDefinition[] =>
  Array(count)
    .fill(null)
    .map((_, idx) => cardGenerator(idx))

export const actionDeck: Deck = {
  cards: [
    ...generateCards(20, (idx) => ({
      id: `action_1_${idx}`,
      affinity: CardAffinity.ATTACK,
      imagePath: getImagePath('actions_01'),
      effects: [{ name: EffectType.PURCHASE_COST, value: 1 }],
    })),
    ...generateCards(10, (idx) => ({
      id: `action_2_${idx}`,
      affinity: CardAffinity.ATTACK,
      imagePath: getImagePath('actions_02'),
      effects: [
        { name: EffectType.PURCHASE_COST, value: 2 },
        { name: EffectType.OWN_CP, value: 2 },
        { name: EffectType.ADD_POPULARITY, value: 1 },
      ],
    })),
    ...generateCards(5, (idx) => ({
      id: `action_3_${idx}`,
      affinity: CardAffinity.ATTACK,
      imagePath: getImagePath('actions_03'),
      effects: [
        { name: EffectType.PURCHASE_COST, value: 3 },
        { name: EffectType.OWN_CP, value: 3 },
        { name: EffectType.TARGET_SELF, value: null },
        { name: EffectType.ADD_POPULARITY, value: 1 },
      ],
    })),
    ...generateCards(2, (idx) => ({
      id: `action_4_${idx}`,
      affinity: CardAffinity.RETARGET_ATTACK,
      imagePath: getImagePath('actions_04'),
      effects: [
        { name: EffectType.PURCHASE_COST, value: 2 },
        { name: EffectType.TARGET_SELECTED, value: null },
        { name: EffectType.ADD_POPULARITY, value: 1 },
      ],
    })),
    ...generateCards(2, (idx) => ({
      id: `action_5_${idx}`,
      affinity: CardAffinity.RETARGET_ATTACK,
      imagePath: getImagePath('actions_05'),
      effects: [
        { name: EffectType.PURCHASE_COST, value: 1 },
        { name: EffectType.DISABLE_SELECTED, value: null },
      ],
    })),
    ...generateCards(3, (idx) => ({
      id: `action_6_${idx}`,
      affinity: CardAffinity.ATTACK,
      imagePath: getImagePath('actions_06'),
      effects: [
        { name: EffectType.PURCHASE_COST, value: 4 },
        { name: EffectType.OWN_CP, value: 3 },
        { name: EffectType.DISABLE_SELF, value: 1 },
        { name: EffectType.ADD_POPULARITY, value: 3 },
      ],
    })),
    ...generateCards(3, (idx) => ({
      id: `action_7_${idx}`,
      affinity: CardAffinity.EFFECT_SELF,
      imagePath: getImagePath('actions_07'),
      effects: [
        { name: EffectType.PURCHASE_COST, value: 2 },
        { name: EffectType.ADD_POPULARITY, value: 5 },
      ],
    })),
    ...generateCards(1, (idx) => ({
      id: `action_8_${idx}`,
      affinity: CardAffinity.ATTACK,
      imagePath: getImagePath('actions_08'),
      effects: [
        { name: EffectType.PURCHASE_COST, value: 5 },
        { name: EffectType.ADD_POPULARITY, value: 4 },
        { name: EffectType.OWN_CP, value: 5 },
      ],
    })),
    ...generateCards(3, (idx) => ({
      id: `action_9_${idx}`,
      affinity: CardAffinity.RETARGET_ATTACK,
      imagePath: getImagePath('actions_09'),
      effects: [
        { name: EffectType.PURCHASE_COST, value: 4 },
        { name: EffectType.ADD_POPULARITY, value: 2 },
        { name: EffectType.TARGET_CP, value: -4 },
      ],
    })),
    ...generateCards(3, (idx) => ({
      id: `action_10_${idx}`,
      affinity: CardAffinity.RETARGET_ATTACK,
      imagePath: getImagePath('actions_10'),
      effects: [
        { name: EffectType.PURCHASE_COST, value: 3 },
        { name: EffectType.ADD_POPULARITY, value: 1 },
        { name: EffectType.SLOW_TARGET, value: null },
      ],
    })),
    ...generateCards(5, (idx) => ({
      id: `action_11_${idx}`,
      affinity: CardAffinity.EFFECT_SELF,
      imagePath: getImagePath('actions_11'),
      effects: [
        { name: EffectType.PURCHASE_COST, value: 4 },
        { name: EffectType.DISABLE_SELECTED, value: 1 },
        { name: EffectType.SACRIFICE_SELF, value: null },
      ],
    })),
  ],
}

export const creatureDeck: Deck = {
  cards: [
    ...Array(9)
      .fill(null)
      .map((_, idx) => ({
        id: `creature_${idx + 1}`,
        affinity: 'creature',
        imagePath: getImagePath(`creatures_${idx + 1}`),
        effects: [{ name: EffectType.PURCHASE_COST, value: 5 }],
      })),
  ],
}

const getCharacterCard = (
  id: number,
  level: number,
  combat: number,
  cost: number,
  extraEffects: IEffectDefinition[] = []
): ICardDefinition => ({
  id: `character_${id}`,
  affinity: 'character',
  imagePath: getImagePath(`characters_${id.toString().padStart(2, '0')}`),
  effects: [
    { name: EffectType.LEVEL, value: level },
    { name: EffectType.PURCHASE_COST, value: cost },
    { name: EffectType.OWN_CP, value: combat },
    ...extraEffects,
  ],
})

// ideally would generate this from the EXCEL nandeck file or generate both from a config... shrug
export const characterDeck: Deck = {
  cards: [
    ...Array(6)
      .fill(null)
      .map((_, idx) =>
        getCharacterCard(idx + 1, 1, 1, 1, [
          { name: EffectType.INITIAL, value: 0 },
        ])
      ), // level 1, cost 1, cp 1
    ...Array(5)
      .fill(null)
      .map((_, idx) => getCharacterCard(idx + 7, 2, 2, 2)), // level 2, cost 2, cp 2
    getCharacterCard(12, 2, 2, 3, [
      { name: EffectType.BONUS_VS_SLOWED, value: 3 },
    ]),
    ...Array(3)
      .fill(null)
      .map((_, idx) =>
        getCharacterCard(idx + 13, 2, 5, 4, [
          { name: EffectType.TARGET_CP, value: -1 },
        ])
      ),
    ...Array(2)
      .fill(null)
      .map((_, idx) =>
        getCharacterCard(idx + 16, 2, 5, 5, [
          { name: EffectType.BONUS_VS_LARGE, value: 2 },
        ])
      ),
    ...Array(2)
      .fill(null)
      .map((_, idx) =>
        getCharacterCard(idx + 18, 2, 5, 5, [
          { name: EffectType.BONUS_VS_LARGE, value: 1 },
        ])
      ),
    ...Array(2)
      .fill(null)
      .map((_, idx) =>
        getCharacterCard(idx + 20, 2, 5, 5, [
          { name: EffectType.BONUS_VS_PACK, value: 2 },
        ])
      ),
    getCharacterCard(22, 2, 5, 4),
    getCharacterCard(23, 3, 7, 7),
    getCharacterCard(24, 3, 7, 7, [
      { name: EffectType.SLOW_TARGET, value: null },
    ]),
    getCharacterCard(25, 3, 8, 10, [
      { name: EffectType.BONUS_VS_SLOWED, value: 5 },
    ]),
    ...Array(2)
      .fill(null)
      .map((_, idx) =>
        getCharacterCard(idx + 26, 3, 7, 9, [
          { name: EffectType.TARGET_CP, value: -3 },
        ])
      ),
    getCharacterCard(28, 3, 7, 7),
    getCharacterCard(29, 3, 6, 8), // TODO: implement bonus when fighting with #30
    getCharacterCard(30, 3, 6, 8, [
      {
        name: EffectType.TARGET_CP,
        value: -3,
      },
    ]), // TODO: implement bonus when fighting with #29
    getCharacterCard(31, 3, 7, 7),
    getCharacterCard(32, 3, 7, 8, [
      {
        name: EffectType.TARGET_CP,
        value: -3,
      },
    ]),
    getCharacterCard(33, 4, 8, 8),
    ...Array(3)
      .fill(null)
      .map((_, idx) =>
        getCharacterCard(idx + 34, 4, 8, 10, [
          { name: EffectType.TARGET_CP, value: -5 },
        ])
      ), // TODO implement bonus when fighting with mirmillo
    getCharacterCard(37, 4, 8, 8, [
      {
        name: EffectType.TARGET_CP,
        value: -3,
      },
    ]),
    ...Array(2)
      .fill(null)
      .map((_, idx) =>
        getCharacterCard(idx + 38, 4, 9, 10, [
          { name: EffectType.TARGET_CP, value: -5 },
          { name: EffectType.ARMOURED, value: null },
        ])
      ),
    getCharacterCard(40, 4, 9, 11, [
      { name: EffectType.TARGET_CP, value: -6 },
      { name: EffectType.ARMOURED, value: null },
    ]),
    getCharacterCard(41, 5, 10, 14, [
      { name: EffectType.TARGET_CP, value: -7 },
      { name: EffectType.ARMOURED, value: null },
    ]),
    ...Array(4)
      .fill(null)
      .map((_, idx) =>
        getCharacterCard(idx + 42, 5, 8, 12, [
          { name: EffectType.TRAEX_TEAM_BONUS, value: -8 },
        ])
      ),
    ...Array(2)
      .fill(null)
      .map((_, idx) =>
        getCharacterCard(idx + 46, 6, 12, 14, [
          { name: EffectType.TARGET_CP, value: -3 },
        ])
      ),
    getCharacterCard(48, 6, 12, 15, [
      { name: EffectType.ADD_POPULARITY, value: 2 },
      { name: EffectType.BONUS_VS_PLAYERS, value: 4 },
    ]),
  ],
}
