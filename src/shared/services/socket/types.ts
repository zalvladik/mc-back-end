import type { SocketTypes } from 'src/shared/constants'

export type UpdateDataAndNotifyClientsProps = {
  type: SocketTypes
  data: any
  username: string
}
