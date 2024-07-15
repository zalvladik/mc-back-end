import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

import { EnchantsTypesEnum } from 'src/shared/enums'
import { getSetsForEnchantMeta } from 'src/shared/helpers/getSetsForEnchantMeta'
import { EnchantMetaTypeEnum } from 'src/shared/constants'

@Entity({ name: 'enchant_meta' })
export class EnchantMeta {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: EnchantsTypesEnum,
    nullable: false,
  })
  @Index()
  enchantType: EnchantsTypesEnum

  @Column({
    type: 'tinyint',
    unsigned: true,
    nullable: false,
  })
  enchantLength: number;

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
