export enum EffectType {
  INITIAL = 'initial',

  SLOWED = 'slowed',
  BONUS_VS_SLOWED = 'bonus_vs_slowed',
  SLOW_TARGET = 'slow_target',

  PACK = 'pack',
  BONUS_VS_PACK = 'bonus_vs_pack',

  LARGE = 'large',
  BONUS_VS_LARGE = 'bonus_vs_large',

  TRAEX_TEAM_BONUS = 'traex',

  BONUS_VS_PLAYERS = 'bonus_vs_players',

  ARMOURED = 'armoured',
  BONUS_VS_ARMOURED = 'bonus_vs_armoured',

  ATTACK = 'attack',
  OWN_CP = 'own_cp',
  TARGET_CP = 'target_cp',
  TARGET_SELF = 'target_self',
  TARGET_SELECTED = 'target_selected',
  DISABLE_SELECTED = 'disable_selected',
  ADD_POPULARITY = 'add_popularity',
  DISABLE_SELF = 'disable_self',
  USAGE_COST = 'usage_popularity',
  PURCHASE_COST = 'purchase_popularity',
  SACRIFICE_SELF = 'sacrifice_self',

  LEVEL = 'level',
}

// Effects which apply beyond just CP
export const LASTING_EFFECTS = [
  EffectType.SLOWED,
  EffectType.ADD_POPULARITY,
  EffectType.DISABLE_SELECTED,
  EffectType.DISABLE_SELF,
  EffectType.SACRIFICE_SELF,
  EffectType.TARGET_SELECTED,
  EffectType.TARGET_SELF,
]
