import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Item } from './item.entity'
import { ItemTicket } from './item-ticket.entity'
import { User } from './user.entity'

@Entity({ name: 'user_inventorys' })
export class UserInventory {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255, nullable: false, unique: true })
  realname: string

  @Column({ type: 'smallint', nullable: false, default: 0 })
  money: number

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToMany(() => Item, item => item.inventory)
  items: Item[]

  @OneToMany(() => ItemTicket, itemTicket => itemTicket.inventory)
  itemTickets: ItemTicket[]
}
