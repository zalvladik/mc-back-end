import { UserVipService } from 'src/modules-site/user/services'
import { Cron } from '@nestjs/schedule'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TaskService {
  constructor(private readonly userVipService: UserVipService) {}

  @Cron('1 0 * * *') // every day at 00:01
  async checkUserVipExpression(): Promise<void> {
    await this.userVipService.checkUserVipExpression()
  }
}
