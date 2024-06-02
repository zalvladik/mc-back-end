import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { ItemTicket } from './item-ticket.entity'
import { Lot } from './lot.entity'
import { UserInventory } from './user-inventory.entity'

@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'smallint', nullable: false })
  amount: number

  @Column({ length: 255, nullable: false })
  type: string

  @Column({ length: 255, nullable: false })
  display_name: string

  @Column('simple-array', { nullable: true })
  description?: string[]

  @Column('simple-array', { nullable: false })
  categories: string[]

  @Column({ type: 'text', nullable: false })
  serialized: string

  @ManyToOne(() => UserInventory, userInventory => userInventory.items)
  @JoinColumn({ name: 'inventory_id' })
  inventory: UserInventory

  @ManyToOne(() => ItemTicket, itemTicket => itemTicket.items, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'item_ticket_id' })
  itemTicket: ItemTicket

  @OneToOne(() => Lot, lot => lot.item, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lot_id' })
  lot: Lot
}
