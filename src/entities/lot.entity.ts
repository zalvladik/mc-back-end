import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Item } from './item.entity'
import { Shulker } from './shulker.entity'
import { TradeHistory } from './trade-history.entity'

@Entity({ name: 'lots' })
@Index(['username'])
@Index(['isSold'])
export class Lot {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'smallint', nullable: false })
  price: number

  @Column({ type: 'varchar', length: 255 })
  username: string

  @OneToOne(() => Item, item => item.lot, {
    nullable: true,
  })
  @JoinColumn({ name: 'item_id' })
  item: Item

  @OneToOne(() => Shulker, shulker => shulker.lot, {
    nullable: true,
  })
  @JoinColumn({ name: 'shulker_id' })
  shulker: Shulker

  @OneToOne(() => TradeHistory, tradeHistory => tradeHistory.lot, {
    nullable: true,
  })
  @JoinColumn({ name: 'trade_history_id' })
  tradeHistory: TradeHistory

  @Column({ type: 'boolean', default: false, nullable: false })
  isSold: boolean
}
