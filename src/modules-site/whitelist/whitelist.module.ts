import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Whitelist } from 'src/entities/whitelist.entity'
import { WhitelistService, WhitelistUserService } from './services'
import { WhitelistController, WhitelistUserController } from './controllers'

@Module({
  imports: [TypeOrmModule.forFeature([Whitelist])],
  controllers: [WhitelistController, WhitelistUserController],
  providers: [WhitelistService, WhitelistUserService],
})
export class WhitelistModule {}
