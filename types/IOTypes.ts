

type RoomRequest = {room_id: string}
type ServerAck = {success: boolean, msg?: string}
type ClientRoomMessage = RoomRequest & {msg: string}
export type MessageIOEvent = {type: 'msg', content: string, username: string, time: string}
type MemberEvent = {type: 'member', username: string, time: string} & (| {status: 'join'} | {status: 'leave'})
export type RoomEvent = MessageIOEvent | MemberEvent
export interface ClientToServerEvents  {
    'request-room': (payload: RoomRequest) => void
    'msg': (payload: ClientRoomMessage) => void

}

export interface ServerToClientEvents {
    'request-room': (payload: ServerAck) => void
    'notify': (payload: ServerAck) => void
    'room-event': (payload: RoomEvent) => void
}