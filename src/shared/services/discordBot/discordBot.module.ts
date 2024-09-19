import { Module, Global } from '@nestjs/common'
import { Whitelist } from 'src/entities/whitelist.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { DiscordBotService } from './discordBot.service'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Whitelist, User])],
  providers: [DiscordBotService],
})
export class DiscordBotModule {}
