import { Module, Global } from '@nestjs/common'
import { Whitelist } from 'src/entities/whitelist.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DsUserLeave } from 'src/entities/ds-user-leave.entity'
import { DiscordBotService } from './discordBot.service'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Whitelist, DsUserLeave])],
  providers: [DiscordBotService],
})
export class DiscordBotModule {}
