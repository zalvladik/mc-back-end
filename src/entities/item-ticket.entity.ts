import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Item } from './item.entity'
import { UserInventory } from './user-inventory.entity'

@Entity({ name: 'item_ticket' })
export class ItemTicket {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => UserInventory, userInventory => userInventory.itemTickets)
  @JoinColumn({ name: 'inventory_id' })
  inventory: UserInventory

  @OneToMany(() => Item, item => item.itemTicket, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'item_ticket_id' })
  items: Item[]
}
