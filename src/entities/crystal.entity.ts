import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { CrystalItemTypeEnum, CrystalTypeEnum } from 'src/shared/enums'
import { User } from './user.entity'

@Entity({ name: 'crystals' })
export class Crystal {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ type: 'bigint', nullable: false })
  customModelData: number

  @Column({
    type: 'enum',
    enum: CrystalTypeEnum,
    nullable: false,
  })
  type: CrystalTypeEnum

  @Column({
    type: 'enum',
    enum: CrystalItemTypeEnum,
    nullable: false,
  })
  itemType: CrystalItemTypeEnum
}
