import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import type {
  ByeItemLotNotificationT,
  ByeShulkerLotNotificationT,
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

  async reloadPpOnServer(): Promise<void> {
    try {
      await axios.post(`${this.minecraftServerURL}/reloadPp`)
    } catch (error) {
      this.logger.verbose(error)
    }
  }
}
