
type RoomId = string
type UserName = string
type SocketId = string
type RoomMembers = Map<UserName, Set<SocketId>> //Each username maps to a series of sockets
//This allows for a user to have multiple tabs without breaking architecture

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
        return Array.from(this.store?.get(roomId)?.keys() ?? [])
    }

    public popUser(roomId: RoomId, username: UserName, socketId: SocketId): boolean {
        const userSet = this.store?.get(roomId)?.get(username)
        if(!userSet) return false

        userSet.delete(socketId)
        if(!userSet.size){
            this.store?.get(roomId)?.delete(username)
            return true
        }
        return false
    }
    public currentlyInStack(roomId: RoomId, username: UserName){
        return !!this.store.get(roomId)?.get(username)?.size
    }
    public roomSize(roomId: RoomId){
        return this.store.get(roomId)?.size ?? 0
    }

    public addUser(roomId: RoomId, username: UserName, socketId: string): boolean{
        let userInit: boolean = false;
        if (!this.store.has(roomId)) {
            this.store.set(roomId, new Map());
        }
        if(!this.store.get(roomId)!.has(username)){
            this.store.get(roomId)!.set(username, new Set())
            userInit = true
        }
        this.store.get(roomId)!.get(username)!.add(socketId)
        return userInit

    }
}