import { Module, Global } from '@nestjs/common'
import { SocketService } from 'src/shared/services/socket/socket.service'
import { WebSocketService } from '../../websocket'

@Global()
@Module({
  providers: [SocketService, WebSocketService],
  exports: [SocketService, WebSocketService],
})
export class SocketModule {}
