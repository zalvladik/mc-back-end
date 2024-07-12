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

  @Column({
    type: 'enum',
    enum: EnchantsTypesEnum,
    nullable: true,
  })
  @Index()
  enchantType: EnchantsTypesEnum

  @OneToOne(() => Item, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'item_id' })
  enchantMeta: Item;

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantMetaTypeEnum.ARMOR),
    nullable: true,
  })
  [EnchantMetaTypeEnum.ARMOR]: string[];

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantMetaTypeEnum.TOOLS_AND_MELEE),
    nullable: true,
  })
  [EnchantMetaTypeEnum.TOOLS_AND_MELEE]: string[];

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantMetaTypeEnum.RANGE_WEAPON),
    nullable: true,
  })
  [EnchantMetaTypeEnum.RANGE_WEAPON]: string[]
}
