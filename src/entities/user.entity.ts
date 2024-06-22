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

  // @Column({ type: 'varchar', length: 50, nullable: true })
  // lastlogin: string

  // @Column({ type: 'bigint', default: 0 })
  // regdate: number

  // @Column({ type: 'smallint', default: 0 })
  // isLogged: number

  @Column({ type: 'smallint', nullable: false, default: 0 })
  money: number

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

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
