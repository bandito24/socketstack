
type RoomId = string
type SocketId = string
type UserName = string
type RoomMembers = Set<UserName>

export class SocketStackStore {
    private static instance: SocketStackStore;
    private store: Map<RoomId, RoomMembers> = new Map();

    static getInstance() {
        if(!this.instance) this.instance = new SocketStackStore();
        return this.instance
    }


    private constructor() {
    }


    public getUsers(roomId: RoomId) {
        return Array.from(this.store?.get(roomId) ?? [])
    }

    public popUser(roomId: RoomId, username: UserName) {
        return !!this.store?.get(roomId)?.delete(username)
    }
    public currentlyInStack(roomId: RoomId, username: UserName){
        return this.store.get(roomId)?.has(username) ? true : false
    }
    public roomSize(roomId: RoomId){
        return this.store.get(roomId)?.size ?? 0
    }
    public deleteRoom(roomId: RoomId){
        return this.store.delete(roomId)
    }
    public addUser(roomId: RoomId, username: UserName){
        if (!this.store.has(roomId)) {
            this.store.set(roomId, new Set());
        }

        const room = this.store.get(roomId)!;
        room.add(username);
    }
}