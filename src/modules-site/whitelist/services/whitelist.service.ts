import { Injectable } from '@nestjs/common'

@Injectable()
export class WhitelistService {
  async createPaymentOrder(body: string): Promise<any> {
    console.log(body)
  }

  async checkStatus(username: string): Promise<any> {
    return null
  }
}
