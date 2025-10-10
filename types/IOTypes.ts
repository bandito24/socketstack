

type RoomRequest = {room_id: string}
type ServerAck = {success: boolean, msg?: string}
type ClientRoomMessage = RoomRequest & {msg: string}
type RoomMessageBroadCast = {msg: string, username: string, time: string}
export interface ClientToServerEvents  {
    'request-room': (payload: RoomRequest) => void
    'msg': (payload: ClientRoomMessage) => void

}

export interface ServerToClientEvents {
    'request-room': (payload: ServerAck) => void
    'notify': (payload: ServerAck) => void
    'msg': (payload: RoomMessageBroadCast) => void
}