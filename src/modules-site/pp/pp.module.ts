import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from 'src/modules-site/auth/auth.module'
import { PpParticle } from 'src/entities/pp/playerparticles_particle.entity'
import { PpGroup } from 'src/entities/pp/playerparticles_group.entity'
import { User } from 'src/entities/user.entity'
import { McFetchingService } from 'src/shared/services/mcFetching/mcFetching.service'
import { PpController } from './controllers'

import { PpService } from './services'

@Module({
  imports: [TypeOrmModule.forFeature([User, PpParticle, PpGroup]), AuthModule],
  controllers: [PpController],
  providers: [PpService, McFetchingService],
})
export class PpModule {}
