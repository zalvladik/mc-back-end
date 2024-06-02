import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'sr_players' })
export class SrPlayer {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  uuid: string

  @Column({ type: 'varchar', length: 2083, nullable: true })
  skin_identifier: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  skin_variant: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  skin_type: string
}
