import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { User } from './user.entity'

@Entity({ name: 'advancements' })
export class Advancements {
  @PrimaryGeneratedColumn()
  id: number

  @Column('simple-array', { nullable: true })
  advancements: string[]

  @Column({ length: 255, nullable: false })
  username: string

  @Column({ type: 'int', nullable: false, default: 0 })
  rating: number

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
