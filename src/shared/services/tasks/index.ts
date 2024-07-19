import type { UserVipService } from 'src/modules-site/user/services'
import { Cron, CronExpression } from '@nestjs/schedule'

export class TaskService {
  constructor(private readonly userVipService: UserVipService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkUserVipExpression(): Promise<void> {
    await this.userVipService.checkUserVipExpression()
  }
}
