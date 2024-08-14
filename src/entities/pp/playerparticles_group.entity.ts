import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('playerparticles_group')
export class PpGroup {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column({ type: 'varchar', length: 36, nullable: true })
  owner_uuid: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string
}
