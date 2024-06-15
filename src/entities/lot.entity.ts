import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Item } from './item.entity'

@Entity({ name: 'lots' })
export class Lot {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'smallint', nullable: false })
  price: number

  @Column({ type: 'varchar', length: 255 })
  realname: string

  @OneToOne(() => Item, item => item.lot, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id', referencedColumnName: 'id' })
  item: Item
}
