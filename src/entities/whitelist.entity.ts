import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'whitelist' })
export class Whitelist {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100, nullable: false })
  username: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  UUID: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  discordUserId: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  discordUserRoles: string

  @Column({ type: 'boolean', default: false, nullable: false })
  isTwink: boolean

  @Column({ type: 'boolean', default: true, nullable: false })
  isExistInDsServer: boolean

  @Column({ type: 'boolean', default: true, nullable: false })
  isNewPlayer: boolean

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    charset: 'utf8',
    collation: 'utf8_general_ci',
  })
  mainUserName: string
}
