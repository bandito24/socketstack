import {chatRooms} from "#root/server/io";

type RoomId = string
type SocketId = string
type UserName = string
type RoomMembers = Set<UserName>

export class ChatRoomStore {
    private static instance: ChatRoomStore;
    private store: Map<RoomId, RoomMembers> = new Map();

    static getInstance() {
        if(!this.instance) this.instance = new ChatRoomStore();
        return this.instance
    }


    private constructor() {
    }


    public getUsers(roomId: RoomId) {
        return Array.from(this.store?.get(roomId) ?? [])
    }

    public deleteUser(roomId: RoomId, username: UserName) {
        return !!this.store?.get(roomId)?.delete(username)
    }
    public belongsToRoom(roomId: RoomId, username: UserName){
        return this.store.get(roomId)?.has(username) ? true : false
    }
    public size(roomId: RoomId){
        return this.store.get(roomId)?.size ?? 0
    }
    public deleteRoom(roomId: RoomId){
        return this.store.delete(roomId)
    }
    public setUser(roomId: RoomId, username: UserName){
        if (!this.store.has(roomId)) {
            this.store.set(roomId, new Set());
        }

        const room = this.store.get(roomId)!;
        room.add(username);
    }
}