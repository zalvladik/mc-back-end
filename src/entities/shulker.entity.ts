// import {
//   Column,
//   Entity,
//   Index,
//   JoinColumn,
//   ManyToOne,
//   OneToMany,
//   PrimaryGeneratedColumn,
// } from 'typeorm'

// import { User } from './user.entity'
// import { ShulkerItem } from './shulker-item.entity'

// @Entity({ name: 'shulker' })
// @Index(['username'])
// export class Shulker {
//   @PrimaryGeneratedColumn()
//   id: number

//   @Column({ type: 'smallint', nullable: false })
//   price: number

//   @Column({ type: 'varchar', length: 255 })
//   username: string

//   @OneToMany(() => ShulkerItem, shulkerItems => shulkerItems.shulker)
//   shulkerItems: ShulkerItem[]

//   @ManyToOne(() => User, user => user.shulkers)
//   @JoinColumn({ name: 'user_id' })
//   user: User
// }
