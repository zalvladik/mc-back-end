import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Item } from './item.entity'

@Entity({ name: 'lots' })
@Index(['username'])
export class Lot {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'smallint', nullable: false })
  price: number

  @Column({ type: 'varchar', length: 255 })
  username: string

  @OneToOne(() => Item, item => item.lot, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id', referencedColumnName: 'id' })
  item: Item
}
