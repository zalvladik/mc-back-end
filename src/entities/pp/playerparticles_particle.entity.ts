import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('playerparticles_particle')
export class PpParticle {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column({ type: 'varchar', length: 36, nullable: true })
  group_uuid: string

  @Column({ type: 'smallint', width: 6, nullable: true })
  id: number

  @Column({ type: 'varchar', length: 100, nullable: true })
  effect: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  style: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  item_material: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  block_material: string

  @Column({ type: 'smallint', width: 6, nullable: true })
  note: number

  @Column({ type: 'smallint', width: 6, nullable: true })
  r: number

  @Column({ type: 'smallint', width: 6, nullable: true })
  g: number

  @Column({ type: 'smallint', width: 6, nullable: true })
  b: number

  @Column({ type: 'smallint', width: 6, nullable: true })
  r_end: number

  @Column({ type: 'smallint', width: 6, nullable: true })
  g_end: number

  @Column({ type: 'smallint', width: 6, nullable: true })
  b_end: number

  @Column({ type: 'int', width: 11, default: 20, nullable: true })
  duration: number
}
