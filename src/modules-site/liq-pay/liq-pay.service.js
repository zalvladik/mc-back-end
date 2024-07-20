import { Injectable } from '@nestjs/common'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const LiqPay = require('../../shared/libs/liqpay')

@Injectable()
export class LiqPayService {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async createPaymentOrder(username) {
    const publicKey = 'sandbox_i18253708308' // Замените на ваш публичный ключ
    const privateKey = 'sandbox_YAaFgqjKZYrH8egw9L9lIXnWELLGMYctGxVXf4ti' // Замените на ваш приватный ключ

    const liqpay = new LiqPay(publicKey, privateKey)

    const html = liqpay.cnb_object({
      action: 'pay',
      amount: 100,
      currency: 'UAH',
      description: `Оплата прохідки на UK-LAND 1.21 для гравця ${username}`,
      version: '3',
      language: 'uk',
      paytypes: 'card',
    })

    return html
  }
}
