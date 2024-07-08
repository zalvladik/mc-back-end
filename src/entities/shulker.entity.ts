import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { CategoryEnum } from 'src/shared/enums'
import { User } from './user.entity'
import { Item } from './item.entity'
import { Lot } from './lot.entity'

@Entity({ name: 'shulkers' })
@Index(['username'])
export class Shulker {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  username: string

  @Column({ length: 255, nullable: false })
  type: string

  @Column({ length: 255, nullable: false })
  display_name: string

  @Column({
    type: 'set',
    enum: [CategoryEnum.SHULKERS],
    default: [CategoryEnum.SHULKERS],
    nullable: false,
  })
  categories: CategoryEnum[]

  @OneToMany(() => Item, Item => Item.shulker)
  items: Item[]

  @ManyToOne(() => User, user => user.shulkers, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToOne(() => Lot, lot => lot.shulker, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'lot_id' })
  lot: Lot
}
