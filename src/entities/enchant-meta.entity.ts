import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { EnchantsTypesEnum } from 'src/shared/enums'
import { getSetsForEnchantMeta } from 'src/shared/helpers/getSetsForEnchantMeta'
import { Item } from './item.entity'

const setsForEnchantMeta = getSetsForEnchantMeta()
const [enchantsPart1, ...enchantsPart2] = [
  setsForEnchantMeta.slice(0, 64),
  ...setsForEnchantMeta.slice(64),
]

@Entity({ name: 'enchant_meta' })
export class EnchantMeta {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => Item, item => item.enchant_meta, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'item_id', referencedColumnName: 'id' })
  item: Item

  @Column({
    type: 'set',
    enum: enchantsPart1,
    nullable: true,
  })
  @Index()
  enchantsPart1: string[]

  @Column({
    type: 'set',
    enum: enchantsPart2,
    nullable: true,
  })
  @Index()
  enchantsPart2: string[]

  @Column({
    type: 'enum',
    enum: EnchantsTypesEnum,
    nullable: true,
  })
  @Index()
  enchantType: EnchantsTypesEnum
}
