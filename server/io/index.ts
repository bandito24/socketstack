import {Server, Socket} from "socket.io";
import {dbPool} from "#root/server/db.ts";
import type {ClientToServerEvents, ServerToClientEvents} from "#root/types/IOTypes.ts";

export type SocketHandlerFn = (socket: Socket) => void

type RoomId = string
type SocketId = string
type UserName = string
type RoomMembers = Set<UserName>

const POLL_MS = 1000


const chatRooms: Map<RoomId, RoomMembers> = new Map();

function authorizedRoomMessage(roomId: string, socketId: string) {
    return chatRooms.get(roomId)?.has(socketId) ? true : false
}

function getUserId(socket: Socket) {
    return socket.handshake.auth.token;
}


export function registerSocketHandlers(io: Server<ClientToServerEvents, ServerToClientEvents>) {
    io.on("connection", async (socket) => {
        if (socket.recovered) {
            console.log("CONNECTION STATE WAS RECOVERED")
            socket.data.sync = true
            // recovery was successful: socket.id, socket.rooms and socket.data were restored
        } else {
            socket.data.sync = false
            // new or unrecoverable session
        }


        const userId = getUserId(socket);
        const {rows} = await dbPool.query('SELECT username FROM users where id = $1', [userId])
        if (!rows) {
            socket.emit('notify', {room_id: '-1', success: false, msg: 'You do not have a valid user ID'})
            socket.disconnect(true);
            return;
        }
        const [{username}] = rows;
        socket.data.username = username

        socket.on('request-room', async (payload) => {
            const {room_id} = payload
            const joined = await validateUserAndJoinRoom(userId, room_id, socket)
            if (joined) {
                const roomSockets = (await io.in(room_id).fetchSockets() ?? []).filter(s => s.id !== socket.id);

                function requestMessages(socketId) {
                    return new Promise((resolve) => {
                        io.timeout(POLL_MS).to(room_id).except(socket.id).emit('request-syncs', {
                            room_id: room_id,
                            socketId: socket.id
                        }, (err, payload) => {
                            if (err) {
                                resolve(false)
                            } else {
                                io.to(payload.socketId).emit('respond-sync', payload)
                                resolve(true)
                            }
                        })
                    })

                }


                for (const roomSocket of roomSockets) {
                    const success = await requestMessages(roomSocket.id)
                    if (success) break
                }
            }
        })

        socket.on('msg', async ({room_id, msg}) => {
            if (!authorizedRoomMessage(room_id, socket.id)) {
                const permitted = await validateUserAndJoinRoom(userId, room_id, socket)
                if (!permitted) {
                    socket.emit('notify', {
                        room_id: room_id,
                        success: false,
                        msg: "You Are not authorized to message this room"
                    })
                    return
                }
            }
            const {username} = socket.data

            io.to(room_id).emit('room-event', {
                room_id: room_id,
                type: 'msg',
                content: msg,
                username: username,
                time: getDateTimeStr()
            })

        })

        socket.on('respond-sync', (payload) => {
            // if(!socket.data?.sync){
            const socket = io.sockets.sockets.get(payload.socketId)
            if (!socket) {
                return
            }
            io.to(payload.socketId).emit('respond-sync', payload)
            socket.data.sync = true;
            // }
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


    async function validateUserAndJoinRoom(userId: string, room_id: string, socket: Socket) {
        const roomId = parseInt(room_id)
        const {rows} = await dbPool.query('SELECT EXISTS (SELECT 1 FROM room_users WHERE user_id = $1 AND room_id = $2)', [userId, roomId])
        if (rows[0].exists) {
            const {username} = socket.data;
            if (socket.data?.activeRoom) {
                console.log(`former active room id ${socket.data?.activeRoom}`)
                const {activeRoom: oldRoom} = socket.data
                chatRooms.get(oldRoom)?.delete(username)
                if (chatRooms.get(oldRoom)?.size) {
                    io.to(oldRoom).except(socket.id).emit('room-event', {
                        type: 'member',
                        status: 'leave',
                        username: username,
                        time: getDateTimeStr(),
                        memberStack: Array.from(chatRooms.get(oldRoom) ?? []),
                        room_id: oldRoom
                    })
                } else {
                    chatRooms.delete(oldRoom)
                }
            }
            if (!chatRooms.has(room_id)) {
                chatRooms.set(room_id, new Set());
            }
            chatRooms.get(room_id)?.add(username)
            socket.join(room_id)
            socket.data.activeRoom = room_id;

            io.to(room_id).emit('room-event', {
                type: 'member',
                status: 'join',
                username: username,
                time: getDateTimeStr(),
                memberStack: Array.from(chatRooms.get(room_id) ?? []),
                room_id: room_id
            })
            const memberStack = Array.from(chatRooms?.get(room_id)?.values() ?? [])
            socket.emit('request-room', {success: true, memberStack: memberStack, room_id: room_id})
            return true
        } else {
            socket.emit('request-room', {
                success: false,
                room_id: room_id,
                msg: 'You are unauthorized to join this room'
            })
            return false
        }
    }
}


function getDateTimeStr() {
    return new Date().toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
        .replace(',', '');
}