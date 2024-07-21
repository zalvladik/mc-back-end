import { Column, Entity, Index } from 'typeorm'

@Entity({ name: 'whitelist' })
@Index(['username'])
export class Whitelist {
  @Column({ type: 'varchar', length: 255 })
  user: string

  @Column({ type: 'varchar', length: 255 })
  UUID: string
}
