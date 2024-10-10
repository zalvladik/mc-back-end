import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { RoleEnum, VipEnum } from 'src/shared/enums'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    charset: 'utf8',
    collation: 'utf8_general_ci',
  })
  realname: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    charset: 'utf8',
    collation: 'utf8_general_ci',
  })
  username: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    charset: 'ascii',
    collation: 'ascii_bin',
  })
  password: string

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
    type: 'enum',
    enum: VipEnum,
    nullable: true,
    default: null,
  })
  vip: VipEnum

  @Column({ type: 'timestamp', default: null })
  vipExpirationDate: Date | null

  @Column('decimal', { precision: 10, scale: 2 })
  money: number

  @Column({ length: 2000, nullable: true })
  refreshToken?: string

  @Column({
    type: 'varchar',
    length: 40,
    nullable: true,
    charset: 'ascii',
    collation: 'ascii_bin',
  })
  ip: string | null

  @Column({ type: 'bigint', nullable: true })
  lastlogin: number | null

  @Column({ type: 'double', default: 0, nullable: false })
  x: number

  @Column({ type: 'double', default: 0, nullable: false })
  y: number

  @Column({ type: 'double', default: 0, nullable: false })
  z: number

  @Column({
    type: 'varchar',
    length: 255,
    default: 'world',
    nullable: false,
    charset: 'utf8',
    collation: 'utf8_general_ci',
  })
  world: string

  @Column({ type: 'bigint', nullable: true })
  regdate: number | null

  @Column({
    type: 'varchar',
    length: 40,
    nullable: true,
    charset: 'ascii',
    collation: 'ascii_bin',
  })
  regip: string | null

  @Column({ type: 'float', default: 0, nullable: false })
  yaw: number

  @Column({ type: 'float', default: 0, nullable: false })
  pitch: number

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    charset: 'utf8',
    collation: 'utf8_general_ci',
  })
  email: string | null

  @Column({ type: 'smallint', default: 0, nullable: false })
  isLogged: number

  @Column({ type: 'smallint', default: 0, nullable: false })
  hasSession: number

  @Column({
    type: 'varchar',
    length: 32,
    nullable: true,
    charset: 'utf8',
    collation: 'utf8_general_ci',
  })
  totp: string | null

  @Column({
    type: 'varchar',
    length: 36,
    nullable: true,
    charset: 'utf8',
    collation: 'utf8_general_ci',
  })
  uuid: string | null

  @Column({ type: 'boolean', default: false, nullable: false })
  isTwink: boolean

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    charset: 'utf8',
    collation: 'utf8_general_ci',
  })
  mainUserName: string
}
