import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'whitelist' })
@Index(['user'])
export class Whitelist {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100, nullable: true })
  user: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  discordUserId: string

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @Column({ type: 'varchar', length: 100, nullable: true })
  UUID: string
}
