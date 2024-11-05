import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { User } from './user.entity'

@Entity({ name: 'user_stats' })
export class UserStats {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ type: 'bigint', nullable: false, default: 0 })
  afkTime: number

  @Column({ type: 'bigint', nullable: false, default: 0 })
  playTime: number

  @Column({ type: 'smallint', nullable: false, default: 0 })
  usedPoints: number

  @Column({ type: 'smallint', nullable: false, default: 0 })
  points: number
}
