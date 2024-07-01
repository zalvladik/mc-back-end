import { Injectable } from '@nestjs/common'
import { WebSocketService } from 'src/shared/websocket'
import type { UpdateDataAndNotifyClientsProps } from './types'

@Injectable()
export class SocketService {
  constructor(private readonly webSocketService: WebSocketService) {}

  async updateDataAndNotifyClients({
    type,
    username,
    data,
  }: UpdateDataAndNotifyClientsProps): Promise<void> {
    const message = { type, data }
    this.webSocketService.sendMessageToClient(username, message)
  }
}
