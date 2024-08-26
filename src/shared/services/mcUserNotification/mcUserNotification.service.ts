import { Injectable } from '@nestjs/common'
import axios from 'axios'
import type {
  ByeItemLotNotificationT,
  ByeShulkerLotNotificationT,
} from './types'

@Injectable()
export class McUserNotificationService {
  async byeItemLotNotification({
    username,
    message,
    serialized,
  }: ByeItemLotNotificationT): Promise<void> {
    await axios.post('http://51.75.74.159:25579/byeItemLotNotification', {
      username,
      message,
      serialized,
    })
  }

  async byeShulkerLotNotification({
    username,
    message,
    serialized,
  }: ByeShulkerLotNotificationT): Promise<void> {
    await axios.post('http://51.75.74.159:25579/byeShulkerLotNotification', {
      username,
      message,
      serialized,
    })
  }
}
