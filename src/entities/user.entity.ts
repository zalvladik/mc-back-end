import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { RoleEnum } from 'src/shared/enums'
import { Advancements } from './advancements.entity'
import { ItemTicket } from './item-ticket.entity'
import { Item } from './item.entity'

@Entity({ name: 'users' })
@Unique(['id', 'username'])
@Index(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  username: string

  @Column({ length: 255, nullable: false })
  uuid: string

  @Column({
    type: 'set',
    enum: [
      RoleEnum.ADMIN,
      RoleEnum.MODERATOR,
      RoleEnum.HELPER,
      RoleEnum.POLICE,
      RoleEnum.USER,
    ],
    default: [RoleEnum.USER],
    nullable: false,
  })
  role: RoleEnum[]

  @Column({
    type: 'varchar',
    length: 255,
    charset: 'ascii',
    collation: 'ascii_bin',
  })
  password: string

  @Column({ type: 'smallint', nullable: false, default: 0 })
  money: number

  @Column({ type: 'bigint', nullable: false })
  mcSession: number

  @Column({ length: 255, nullable: false })
  ip: string

  @OneToMany(() => Item, item => item.user)
  items: Item[]

  @OneToMany(() => ItemTicket, itemTicket => itemTicket.user)
  itemTickets: ItemTicket[]

  @Column({ length: 2000, nullable: true })
  refreshToken?: string

  @OneToOne(() => Advancements)
  @JoinColumn({ name: 'advancements_id' })
  advancements: Advancements
}
