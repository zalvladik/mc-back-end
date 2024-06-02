import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'sr_player_skins' })
export class SrPlayerSkin {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  uuid: string

  @Column({ type: 'varchar', length: 16, nullable: true })
  last_known_name: string

  @Column({ type: 'text', nullable: false })
  value: string

  @Column({ type: 'text', nullable: false })
  signature: string

  @Column({ type: 'bigint', nullable: false })
  timestamp: number
}
