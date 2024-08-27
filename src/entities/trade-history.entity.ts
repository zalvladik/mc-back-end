import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm'
import { User } from './user.entity'
import { Lot } from './lot.entity'

@Entity({ name: 'trade_history' })
export class TradeHistory {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, user => user.tradeHistoriesAsSeller, {
    nullable: false,
  })
  @JoinColumn({ name: 'seller_user_id' })
  seller: User

  @ManyToOne(() => User, user => user.tradeHistoriesAsBuyer, {
    nullable: false,
  })
  @JoinColumn({ name: 'buyer_user_id' })
  buyer: User

  @OneToOne(() => Lot, lot => lot.tradeHistory, {
    nullable: false,
  })
  @JoinColumn({ name: 'lot_id' })
  lot: Lot

  @Column({ type: 'bigint', nullable: false })
  trade_time: number
}
