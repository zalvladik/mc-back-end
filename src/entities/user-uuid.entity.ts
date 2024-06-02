import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'user_uuid' })
export class UserUUID {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255, nullable: false })
  uuid: string

  @Column({ length: 255, nullable: false })
  realname: string
}
