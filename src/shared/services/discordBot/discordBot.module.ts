import { Module, Global } from '@nestjs/common'
import { McWhitelist } from 'src/entities/mc-whitelist.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { DiscordBotService } from './discordBot.service'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([McWhitelist, User])],
  providers: [DiscordBotService],
})
export class DiscordBotModule {}
