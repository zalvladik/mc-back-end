import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { EnchantsTypesEnum } from 'src/shared/enums'
import { getSetsForEnchantMeta } from 'src/shared/helpers/getSetsForEnchantMeta'
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
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantsTypesEnum.HELMET),
    nullable: true,
  })
  helmet: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantsTypesEnum.CHESTPLATE),
    nullable: true,
  })
  chestplate: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantsTypesEnum.LEGGINGS),
    nullable: true,
  })
  leggings: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantsTypesEnum.BOOTS),
    nullable: true,
  })
  boots: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantsTypesEnum.ELYTRA),
    nullable: true,
  })
  elytra: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantsTypesEnum.SWORD),
    nullable: true,
  })
  sword: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantsTypesEnum.AXE),
    nullable: true,
  })
  axe: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantsTypesEnum.TRIDENT),
    nullable: true,
  })
  trident: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantsTypesEnum.MACE),
    nullable: true,
  })
  mace: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantsTypesEnum.PICKAXE),
    nullable: true,
  })
  pickaxe: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantsTypesEnum.SHOVEL),
    nullable: true,
  })
  shovel: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantsTypesEnum.HOE),
    nullable: true,
  })
  hoe: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantsTypesEnum.BOW),
    nullable: true,
  })
  bow: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantsTypesEnum.CROSSBOW),
    nullable: true,
  })
  crossbow: string[]

  @Column({
    type: 'set',
    enum: getSetsForEnchantMeta(EnchantsTypesEnum.FISHING_ROD),
    nullable: true,
  })
  fishing_rod: string[]

  @Column({ length: 255, nullable: false })
  enchantType: EnchantsTypesEnum
}
