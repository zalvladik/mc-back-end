import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { CrystalTypeEnum } from 'src/shared/enums'

@Entity({ name: 'crystal_loot_boxes' })
@Index(['type'])
export class CrystalLootBox {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: CrystalTypeEnum,
    nullable: false,
  })
  type: CrystalTypeEnum

  @Column({ type: 'smallint', nullable: false, default: 0 })
  openCount: number

  @Column({ type: 'smallint', nullable: false, default: 0 })
  price: number

  @Column({ type: 'smallint', nullable: false, default: 0 })
  hoursePrice: number
}
