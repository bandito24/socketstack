import {Server, Socket} from "socket.io";
import {dbPool} from "#root/server/db.ts";
import type {ClientToServerEvents, ServerToClientEvents} from "#root/types/IOTypes.ts";

export type SocketHandlerFn = (socket: Socket) => void

type RoomId = string
type SocketId = string
type UserName = string
type RoomMembers = Map<SocketId, UserName>


const chatRooms: Map<RoomId, RoomMembers> = new Map();

function authorizedRoomMessage(roomId: string, socketId: string){
    return chatRooms.get(roomId)?.has(socketId) ? true : false
}
function getUserId(socket: Socket){
    return socket.handshake.auth.token;
}


export function registerSocketHandlers(io: Server<ClientToServerEvents, ServerToClientEvents>) {
    io.on("connection", (socket) => {
        const userId = getUserId(socket);

        socket.on('request-room', async (payload) => {
            const {room_id} = payload
          await validateUserAndJoinRoom(userId, room_id, socket)
        })

        socket.on('msg', async ({room_id, msg}) => {
            if(!authorizedRoomMessage(room_id, socket.id)){
                socket.emit('notify', {success: false, msg: "You Are not authorized to message this room"})
                return
            }
            let username: string | undefined | null = chatRooms.get(room_id)?.get(socket.id)
            if(!username){
                console.error('SOCKET ID NOT MAPPED TO ROOM_ID')
                username = await validateUserAndJoinRoom(userId, room_id, socket)
                if(!username) return //Notify user in the validation fn
            }
            io.to(room_id).emit('room-event', {type: 'msg', content: msg, username: username, time: getDateTimeStr()})

        })

        socket.on('disconnecting', () => {
            const {rooms} = socket;
            console.log('disconnecting')
            for (const room of rooms) {
                if (room === socket.id) continue; // skip private room
                chatRooms.get(room)?.delete(socket.id)
                console.log("User left room:", room);
            }
        })




    });
}

async function validateUserAndJoinRoom(userId: string, room_id: string, socket: Socket){
    const roomId = parseInt(room_id)
    const {rows, rowCount} = await dbPool.query('SELECT username FROM room_users ru JOIN users u ON ru.user_id = u.id WHERE ru.user_id = $1 AND ru.room_id = $2', [userId, roomId])
    if(rowCount){
        const [{username}] = rows;
        if (!chatRooms.has(room_id)) {
            chatRooms.set(room_id, new Map());
        }
        chatRooms.get(room_id)?.set(socket.id, username)
        socket.join(room_id)
        socket.emit('request-room', {success: true})
        return username
    } else {
        socket.emit('request-room', {success: false, msg: 'You are unauthorized to join this room'})
        return null
    }
}

function getDateTimeStr(){
    return new Date().toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
        .replace(',', '');
}