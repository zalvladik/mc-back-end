import type { SocketEnum } from 'src/shared/enums'

export type UpdateDataAndNotifyClientsProps = {
  type: SocketEnum
  data: any
  username: string
}
