import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserService } from 'src/modules-site/user/services'

import { Crystal } from 'src/entities/crystal.entity'

import { CrystalLootBox } from 'src/entities/crystal-loot-box.entity'
import { User } from 'src/entities/user.entity'
import { AuthModule } from '../auth/auth.module'
import { CrystalController, CrystalLootBoxController } from './controllers'
import { CrystalLootBoxService, CrystalService } from './services'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Crystal, CrystalLootBox]),
    AuthModule,
  ],
  controllers: [CrystalController, CrystalLootBoxController],
  providers: [CrystalService, CrystalLootBoxService, UserService],
})
export class CrystalModule {}
