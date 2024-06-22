import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Item } from './item.entity'
import { User } from './user.entity'

@Entity({ name: 'item_ticket' })
export class ItemTicket {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, user => user.itemTickets)
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToMany(() => Item, item => item.itemTicket, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'item_ticket_id' })
  items: Item[]
}
