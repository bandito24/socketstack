type RequestBase = { room_id: string }
type ServerAck =  RequestBase & { success: boolean, msg?: string, memberStack?: string[] }
type ClientRoomMessage = RequestBase & { msg: string }
export type MessageIOEvent = RequestBase & { type: 'msg', content: string, username: string, time: string, stackCount: number }
export type MemberEvent = RequestBase & { type: 'member', username: string, time: string, memberStack: string[] } & (| { status: 'join' } | {
    status: 'leave'
})
export type RoomEvent = RequestBase & (MessageIOEvent | MemberEvent);
export type RespondSync = RequestBase & {data: MessageIOEvent[], socketId: string}

export interface ClientToServerEvents {
    'request-room': (payload: RequestBase) => void
    'msg': (payload: ClientRoomMessage) => void
    'respond-sync': (payload: RespondSync) => void
}

export interface ServerToClientEvents {
    'request-room': (payload: ServerAck) => void
    'notify': (payload: ServerAck) => void
    'member-event': (payload: MemberEvent) => void
    'msg-event': (payload: MessageIOEvent) => void
    'respond-sync': (payload: RespondSync) => void
    'request-sync': (payload: RequestBase & { socketId: string}, callback: (response: RespondSync) => void) => void
}