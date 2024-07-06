import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { CategoryEnum } from 'src/shared/enums'
import { Shulker } from './shulker.entity'

@Entity({ name: 'shulker_items' })
export class ShulkerItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'smallint', nullable: false })
  amount: number

  @Column({ length: 255, nullable: false })
  type: string

  @Column({ length: 255, nullable: false })
  display_name: string

  @Column('simple-array', { nullable: true })
  description?: string[]

  @Column('simple-array', { nullable: true })
  enchants?: string[]

  @Column({
    type: 'set',
    enum: [
      CategoryEnum.BUILD_BLOCKS,
      CategoryEnum.COLOR_BLOCKS,
      CategoryEnum.FOODS_AND_POTIONS,
      CategoryEnum.FUNCTIONAL_BLOCKS,
      CategoryEnum.INGREDIENTS,
      CategoryEnum.NATURE_BLOCKS,
      CategoryEnum.REDSTONE_BLOCKS,
      CategoryEnum.TOOLS,
      CategoryEnum.WEAPONS,
    ],
    nullable: false,
  })
  categories: CategoryEnum[]

  @Column({ type: 'text', nullable: false })
  serialized: string

  @ManyToOne(() => Shulker, shulker => shulker.shulkerItems, {
    nullable: false,
  })
  @JoinColumn({ name: 'shulker_id' })
  shulker: Shulker
}
