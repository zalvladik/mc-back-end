import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import type {
  ByeItemLotNotificationT,
  ByeShulkerLotNotificationT,
  HandleAddPPT,
  HandleDeletePPT,
} from './types'

@Injectable()
export class McFetchingService {
  private logger = new Logger('McFetchingService')

  private minecraftServerURL = process.env.MINECRAFT_SERVER_URL

  async byeItemLotNotification({
    username,
    message,
    serialized,
  }: ByeItemLotNotificationT): Promise<void> {
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
  }: ByeShulkerLotNotificationT): Promise<void> {
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

  async handleAddPP({ effect, style, username }: HandleAddPPT): Promise<void> {
    try {
      await axios.post(`${this.minecraftServerURL}/handleAddPP`, {
        effect,
        style,
        username,
      })
    } catch (error) {
      this.logger.verbose(error)
    }
  }

  async handleDeletePP({ id, username }: HandleDeletePPT): Promise<void> {
    try {
      await axios.post(`${this.minecraftServerURL}/handleDeletePP`, {
        id,
        username,
      })
    } catch (error) {
      this.logger.verbose(error)
    }
  }
}
