import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { RoleEnum } from 'src/shared/enums'
import { Advancements } from './advancements.entity'
import { UserInventory } from './user-inventory.entity'

@Entity({ name: 'users' })
@Unique(['realname', 'username'])
@Index(['realname'])
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  username: string

  @Column({ type: 'varchar', length: 255 })
  realname: string

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

  @Column({
    type: 'varchar',
    length: 40,
    charset: 'ascii',
    collation: 'ascii_bin',
    nullable: true,
  })
  ip: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastlogin: string

  @Column({ type: 'double', default: 0 })
  x: number

  @Column({ type: 'double', default: 0 })
  y: number

  @Column({ type: 'double', default: 0 })
  z: number

  @Column({ type: 'varchar', length: 255, default: 'world' })
  world: string

  @Column({ type: 'bigint', default: 0 })
  regdate: number

  @Column({
    type: 'varchar',
    length: 40,
    charset: 'ascii',
    collation: 'ascii_bin',
    nullable: true,
  })
  regip: string

  @Column({ type: 'float', nullable: true })
  yaw: number

  @Column({ type: 'float', nullable: true })
  pitch: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string

  @Column({ type: 'smallint', default: 0 })
  isLogged: number

  @Column({ type: 'smallint', default: 0 })
  hasSession: number

  @Column({ type: 'varchar', length: 32, nullable: true })
  totp: string

  @Column({ length: 2000, nullable: true })
  refreshToken?: string

  @OneToOne(() => UserInventory)
  @JoinColumn({ name: 'user_inventory_id' })
  userInventory: UserInventory

  @OneToOne(() => Advancements)
  @JoinColumn({ name: 'advancements_id' })
  advancements: Advancements
}
