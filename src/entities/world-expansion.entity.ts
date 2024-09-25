import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { WorldEnum } from 'src/shared/enums'
import { Item } from './item.entity'
import type { WorldExpansionPayments } from './world-expansion-payments.entity'

@Entity({ name: 'world_expansion' })
export class WorldExpansion {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: WorldEnum,
    nullable: false,
  })
  worldType: WorldEnum

  @Column({ type: 'smallint', nullable: false })
  lvl: number

  @Column({ type: 'smallint', nullable: false, default: 0 })
  moneyStorage: number

  @Column({ type: 'smallint', nullable: false })
  cost: number

  @Column({ type: 'boolean', default: false, nullable: false })
  isCompleted: boolean

  @Column({ type: 'timestamp', nullable: false })
  createdAt: Date

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date

  @OneToMany(() => Item, item => item.itemTicket)
  @JoinColumn({ name: 'payment_ids' })
  worldExpansionPayments: WorldExpansionPayments[]
}
