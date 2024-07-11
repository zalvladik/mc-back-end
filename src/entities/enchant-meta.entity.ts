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
import { EnchantMetaTypeEnum } from 'src/shared/constants'
import { Item } from './item.entity'

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
    type: 'enum',
    enum: EnchantsTypesEnum,
    nullable: true,
  })
  @Index()
  enchantType: EnchantsTypesEnum

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantMetaTypeEnum.ARMOR),
    nullable: true,
  })
  armor: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantMetaTypeEnum.TOOLS_AND_MELEE),
    nullable: true,
  })
  toolsAndMelle: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantMetaTypeEnum.RANGE_WEAPON),
    nullable: true,
  })
  rangeWeapon: string[]
}
