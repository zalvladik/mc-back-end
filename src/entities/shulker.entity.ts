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
import { ShulkerItem } from './shulker-item.entity'

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

  @OneToMany(() => ShulkerItem, shulkerItems => shulkerItems.shulker, {
    nullable: false,
  })
  shulkerItems: ShulkerItem[]

  @ManyToOne(() => User, user => user.shulkers)
  @JoinColumn({ name: 'user_id' })
  user: User
}
