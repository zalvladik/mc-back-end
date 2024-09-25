import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { WorldEnum } from 'src/shared/enums'
import type {
  ByeItemLotNotificationProps,
  ByeShulkerLotNotificationProps,
  HandleAddPPProps,
  HandleDeletePPProps,
  WorldExansionProps,
} from './types'

@Injectable()
export class McFetchingService {
  private logger = new Logger('McFetchingService')

  private minecraftServerURL = process.env.MINECRAFT_SERVER_URL

  async byeItemLotNotification({
    username,
    message,
    serialized,
  }: ByeItemLotNotificationProps): Promise<void> {
    try {
      await axios.post(`${this.minecraftServerURL}/byeItemLotNotification`, {
        username,
        message,
        serialized,
      })
    } catch (error) {
      this.logger.verbose(error)
    }
  }

  async byeShulkerLotNotification({
    username,
    message,
    serializedArray,
  }: ByeShulkerLotNotificationProps): Promise<void> {
    try {
      await axios.post(`${this.minecraftServerURL}/byeShulkerLotNotification`, {
        username,
        message,
        serializedArray,
      })
    } catch (error) {
      this.logger.verbose(error)
    }
  }

  async handleAddPP({
    effect,
    style,
    username,
  }: HandleAddPPProps): Promise<void> {
    await axios.post(`${this.minecraftServerURL}/handleAddPP`, {
      effect,
      style,
      username,
    })
  }

  async handleDeletePP({ id, username }: HandleDeletePPProps): Promise<void> {
    await axios.post(`${this.minecraftServerURL}/handleDeletePP`, {
      id,
      username,
    })
  }

  async worldExansion({ worldType, lvl }: WorldExansionProps): Promise<void> {
    const getWorldRadius = (howMuch: number): number => {
      return 500 * howMuch + 2500
    }

    let radius = getWorldRadius(lvl)

    if (worldType === WorldEnum.WORLD_NETHER) {
      radius /= 8
    }

    await axios.post(`${this.minecraftServerURL}/worldExtansion`, {
      worldType,
      radius,
    })
  }
}
