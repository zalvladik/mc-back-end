import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import type {
  ByeItemLotNotificationT,
  ByeShulkerLotNotificationT,
  HandleAddPPT,
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

  async handleAddPP({ effect, style }: HandleAddPPT): Promise<void> {
    try {
      await axios.post(`${this.minecraftServerURL}/handleAddPP`, {
        effect,
        style,
      })
    } catch (error) {
      this.logger.verbose(error)
    }
  }

  async handleDeletePP(id: number): Promise<void> {
    try {
      await axios.post(`${this.minecraftServerURL}/handleDeletePP`, { id })
    } catch (error) {
      this.logger.verbose(error)
    }
  }
}
