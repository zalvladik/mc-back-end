import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'ds_user_leave' })
@Index(['user'])
export class DsUserLeave {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100, nullable: true })
  user: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  discordUserId: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  UUID: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  discordUserRoles: string
}
