import { Column, Entity, Index, PrimaryColumn } from 'typeorm'

@Entity({ name: 'whitelist' })
@Index(['user'])
export class Whitelist {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  user: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  UUID: string
}
