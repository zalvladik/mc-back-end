import type { VipEnum } from 'src/shared/enums'

export type ByeVipProps = {
  vip: VipEnum
  id: number
  userVip: VipEnum
}

export type UpgradeVipProps = {
  vip: VipEnum
  id: number
}
