import type {
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import type { Socket } from 'socket.io'
import { Server } from 'socket.io'

@WebSocketGateway({ cors: { origin: '*' } })
export class WebSocketService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server

  private users = new Map<string, Socket>()

  handleConnection(client: Socket): void {
    const username = client.handshake.query.username as string

    if (username) {
      this.users.set(username, client)
    } else {
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket): void {
    const username = client.handshake.query.username as string

    if (username) {
      this.users.delete(username)
    }
  }

  sendMessageToClient(username: string, message: any): void {
    const user = this.users.get(username)

    if (user) {
      user.emit('message', message)
    }
  }
}
