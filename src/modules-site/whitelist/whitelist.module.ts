import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Whitelist } from 'src/entities/whitelist.entity'
import { WhitelistService } from './services'
import { WhitelistController } from './controllers'

@Module({
  imports: [TypeOrmModule.forFeature([Whitelist])],
  controllers: [WhitelistController],
  providers: [WhitelistService],
})
export class WhitelistModule {}
