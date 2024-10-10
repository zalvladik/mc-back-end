import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Item } from './item.entity'
import { Shulker } from './shulker.entity'
import { User } from './user.entity'

@Entity({ name: 'lots' })
@Index(['isSold'])
export class Lot {
  @PrimaryGeneratedColumn()
  id: number

  @Column('decimal', { precision: 10, scale: 1 })
  price: number

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Item, {
    nullable: true,
  })
  @JoinColumn({ name: 'item_id' })
  item: Item

  @ManyToOne(() => Shulker, {
    nullable: true,
  })
  @JoinColumn({ name: 'shulker_id' })
  shulker: Shulker

  @Column({ type: 'boolean', default: false, nullable: false })
  isSold: boolean
}
