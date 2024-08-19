import { Module, Global } from '@nestjs/common'
import { Whitelist } from 'src/entities/whitelist.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DiscordBotService } from './discordBot.service'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Whitelist])],
  providers: [DiscordBotService],
})
export class DiscordBotModule {}
