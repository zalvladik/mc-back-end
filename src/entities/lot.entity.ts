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

@Entity({ name: 'lots' })
@Index(['username'])
@Index(['isSold'])
export class Lot {
  @PrimaryGeneratedColumn()
  id: number

  @Column('decimal', { precision: 10, scale: 2 })
  price: number

  @Column({ type: 'varchar', length: 255 })
  username: string

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
