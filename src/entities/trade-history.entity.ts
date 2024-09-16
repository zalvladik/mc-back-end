import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
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

  @ManyToOne(() => Lot, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'lot_id' })
  lot: Lot

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date
}
