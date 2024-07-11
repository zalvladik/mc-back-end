import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { EnchantsTypesEnum } from 'src/shared/enums'
import { getSetsForEnchantTypes } from 'src/shared/helpers/getSetsForEnchantTypes/getSetsForEnchantTypes'
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

  //   @Column({
  //     type: 'set',
  //     enum: getSetsForEnchantTypes(EnchantsTypesEnum.HELMET),
  //     nullable: true,
  //   })
  //   [EnchantsTypesEnum.HELMET]: []

  @Column({ length: 255, nullable: false })
  enchantType: EnchantsTypesEnum
}
