import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'whitelist' })
@Index(['user'])
export class Whitelist {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100, nullable: true })
  user: string

  @Column({ type: 'datetime', nullable: false })
  time: Date

  @Column({ type: 'varchar', length: 100, nullable: true })
  UUID: string
}
