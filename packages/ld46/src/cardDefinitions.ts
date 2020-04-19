import { Deck } from '@jou/common'

import { EffectType } from './effectDefinitions'

const getImagePath = (name: string) =>
  `https://bythesword-cards.s3-ap-southeast-2.amazonaws.com/${name}.png`

const generateCards = (
  count: number,
  cardGenerator: (idx: number) => { [key: string]: any }
) =>
  Array(count)
    .fill(null)
    .map((item, idx) => cardGenerator(idx))

export const actionDeck: Deck = {
  cards: [
    ...generateCards(20, (idx) => ({
      id: `action_1_${idx}`,
      affinity: 'attack',
      imagePath: getImagePath('actions_01'),
      effects: [{ name: EffectType.PURCHASE_EXCITEMENT, value: 1 }],
    })),
    ...generateCards(10, (idx) => ({
      id: `action_2_${idx}`,
      affinity: 'attack',
      imagePath: getImagePath('actions_02'),
      effects: [
        { name: EffectType.PURCHASE_EXCITEMENT, value: 2 },
        { name: EffectType.WARRIOR_CP, value: 2 },
        { name: EffectType.ADD_EXCITEMENT, value: 1 },
      ],
    })),
    ...generateCards(5, (idx) => ({
      id: `action_3_${idx}`,
      affinity: 'attack',
      imagePath: getImagePath('actions_03'),
      effects: [
        { name: EffectType.PURCHASE_EXCITEMENT, value: 3 },
        { name: EffectType.WARRIOR_CP, value: 3 },
        { name: EffectType.TARGET_SELF, value: null },
        { name: EffectType.ADD_EXCITEMENT, value: 1 },
      ],
    })),
    ...generateCards(2, (idx) => ({
      id: `action_4_${idx}`,
      affinity: 'redirect',
      imagePath: getImagePath('actions_04'),
      effects: [
        { name: EffectType.PURCHASE_EXCITEMENT, value: 2 },
        { name: EffectType.TARGET_SELECTED, value: null },
        { name: EffectType.ADD_EXCITEMENT, value: 1 },
      ],
    })),
    ...generateCards(2, (idx) => ({
      id: `action_5_${idx}`,
      affinity: 'redirect',
      imagePath: getImagePath('actions_05'),
      effects: [
        { name: EffectType.PURCHASE_EXCITEMENT, value: 1 },
        { name: EffectType.DISABLE_SELECTED, value: null },
      ],
    })),
    ...generateCards(3, (idx) => ({
      id: `action_6_${idx}`,
      affinity: 'attack',
      imagePath: getImagePath('actions_06'),
      effects: [
        { name: EffectType.PURCHASE_EXCITEMENT, value: 4 },
        { name: EffectType.WARRIOR_CP, value: 3 },
        { name: EffectType.DISABLE_SELF, value: 1 },
        { name: EffectType.ADD_EXCITEMENT, value: 3 },
      ],
    })),
    ...generateCards(3, (idx) => ({
      id: `action_7_${idx}`,
      affinity: 'effect',
      imagePath: getImagePath('actions_07'),
      effects: [
        { name: EffectType.PURCHASE_EXCITEMENT, value: 2 },
        { name: EffectType.ADD_EXCITEMENT, value: 5 },
      ],
    })),
    ...generateCards(1, (idx) => ({
      id: `action_8_${idx}`,
      affinity: 'attack',
      imagePath: getImagePath('actions_08'),
      effects: [
        { name: EffectType.PURCHASE_EXCITEMENT, value: 5 },
        { name: EffectType.ADD_EXCITEMENT, value: 4 },
        { name: EffectType.WARRIOR_CP, value: 5 },
      ],
    })),
    ...generateCards(3, (idx) => ({
      id: `action_9_${idx}`,
      affinity: 'redirect',
      imagePath: getImagePath('actions_09'),
      effects: [
        { name: EffectType.PURCHASE_EXCITEMENT, value: 4 },
        { name: EffectType.ADD_EXCITEMENT, value: 2 },
        { name: EffectType.CREATURE_CP, value: -4 },
      ],
    })),
    ...generateCards(3, (idx) => ({
      id: `action_10_${idx}`,
      affinity: 'redirect',
      imagePath: getImagePath('actions_10'),
      effects: [
        { name: EffectType.PURCHASE_EXCITEMENT, value: 3 },
        { name: EffectType.ADD_EXCITEMENT, value: 1 },
        { name: EffectType.SLOW_TARGET, value: null },
      ],
    })),
  ],
}

export const creatureDeck: Deck = {
  cards: [
    ...Array(48)
      .fill(null)
      .map((_, idx) => ({
        id: `creature_${idx}`,
        affinity: 'creature',
        imagePath: getImagePath(`creatures_${idx.toString().padStart(2, '0')}`),
        effects: [],
      })),
  ],
}

export const fighterDeck: Deck = {
  cards: [
    ...Array(48)
      .fill(null)
      .map((_, idx) => ({
        id: `character_${idx}`,
        affinity: 'character',
        imagePath: getImagePath(
          `characters_${idx.toString().padStart(2, '0')}`
        ),
        effects: [],
      })),
  ],
}
