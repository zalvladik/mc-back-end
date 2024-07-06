import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { CategoryEnum } from 'src/shared/enums'
import { ItemTicket } from './item-ticket.entity'
import { Lot } from './lot.entity'
import { User } from './user.entity'

@Entity({ name: 'items' })
@Index(['user'])
export class Item {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'smallint', nullable: false })
  amount: number

  @Column({ length: 255, nullable: false })
  type: string

  @Column({ length: 255, nullable: true })
  durability: string

  @Column({ length: 255, nullable: false })
  display_name: string

  @Column('simple-array', { nullable: true })
  description?: string[]

  @Column('simple-array', { nullable: true })
  enchants?: string[]

  @Column({
    type: 'set',
    enum: [
      CategoryEnum.BUILD_BLOCKS,
      CategoryEnum.COLOR_BLOCKS,
      CategoryEnum.FOODS_AND_POTIONS,
      CategoryEnum.FUNCTIONAL_BLOCKS,
      CategoryEnum.INGREDIENTS,
      CategoryEnum.NATURE_BLOCKS,
      CategoryEnum.REDSTONE_BLOCKS,
      CategoryEnum.TOOLS,
      CategoryEnum.WEAPONS,
    ],
    nullable: false,
  })
  categories: CategoryEnum[]

  @Column({ type: 'text', nullable: false })
  serialized: string

  @ManyToOne(() => User, user => user.items)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => ItemTicket, itemTicket => itemTicket.items, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'item_ticket_id' })
  itemTicket: ItemTicket

  @OneToOne(() => Lot, lot => lot.item, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lot_id' })
  lot: Lot
}
