import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { User } from './user.entity'
import { Item } from './item.entity'

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

  @OneToMany(() => Item, Item => Item.shulker)
  items: Item[]

  @ManyToOne(() => User, user => user.shulkers)
  @JoinColumn({ name: 'user_id' })
  user: User
}
