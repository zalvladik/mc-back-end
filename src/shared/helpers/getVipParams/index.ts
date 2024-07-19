import {
  LOTS_COUNT,
  ITEMS_COUNT,
  SHULKERS_COUNT,
  vipMultipliers,
} from 'src/shared/constants'
import type { VipEnum } from 'src/shared/enums'
import type { VipParamsT } from 'src/shared/types'

export const getVipParams = (userVip: VipEnum | null): VipParamsT => {
  const multiplier = userVip ? vipMultipliers[userVip] : 1

  return {
    vipShulkerCount: SHULKERS_COUNT * multiplier,
    vipItemCount: ITEMS_COUNT * multiplier,
    vipLotCount: LOTS_COUNT * multiplier,
  }
}
