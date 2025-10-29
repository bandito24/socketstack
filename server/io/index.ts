import {Server, Socket} from "socket.io";
import {dbPool} from "#root/server/db.ts";
import type {ClientToServerEvents, ServerToClientEvents} from "#root/types/IOTypes.ts";
import {SocketStackStore} from "#root/server/lib/chatRoomStore.ts";

export type SocketHandlerFn = (socket: Socket) => void


const POLL_MS = 1000

const STORE = SocketStackStore.getInstance()


function getUserId(socket: Socket) {
    return socket.handshake.auth.token;
}


export function registerSocketHandlers(io: Server<ClientToServerEvents, ServerToClientEvents>) {
    io.on("connection", async (socket) => {
        if (socket.recovered) {
            console.log("CONNECTION STATE WAS RECOVERED")
            // recovery was successful: socket.id, socket.rooms and socket.data were restored
        }

        const userId = getUserId(socket);
        if (userId) {
            const {rows} = await dbPool.query('SELECT room_id FROM room_users where user_id = $1', [userId])
            for (const row of rows) {
                socket.join(row.room_id.toString())
            }
        }
        const {rows} = await dbPool.query('SELECT username FROM users where id = $1', [userId])
        if (!rows.length) {
            socket.emit('notify', {room_id: '-1', success: false, msg: 'You do not have a valid user ID'})
            socket.disconnect(true);
            return;
        }
        const [{username}] = rows;
        socket.data.username = username

        socket.on('request-room', async (payload) => {
            const {room_id} = payload
            if (socket.data?.activeRoom === payload.room_id && STORE.currentlyInStack(room_id, socket.data?.username)) {
                return;
            }


            const joined = await validateUserAndJoinRoom(io, userId, room_id, socket)
            if (joined) {
                const roomSockets = (await io.in(room_id).fetchSockets() ?? [])
                    .filter(s => s.id !== socket.id);

                function requestMessages(socketId) {

                    return new Promise((resolve) => {
                        io.timeout(POLL_MS).to(socketId).emit('request-sync', {
                            room_id: room_id,
                            socketId: socket.id
                        }, (err, payloads) => {
                            if (err) {
                                resolve(false)
                            } else {
                                const payload = Array.isArray(payloads) ? payloads[0] : payloads;

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
            if (!STORE.currentlyInStack(room_id, socket.data.username)) {
                const permitted = await validateUserAndJoinRoom(io, userId, room_id, socket)
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

            io.to(room_id).emit('msg-event', {
                room_id: room_id,
                type: 'msg',
                content: msg,
                username: username,
                stackCount: STORE.getUsers(room_id).length,
                time: getDateTimeStr()
            })

        })

        socket.on('respond-sync', (payload) => {
            const socket = io.sockets.sockets.get(payload.socketId)
            if (!socket) {
                return
            }
            io.to(payload.socketId).emit('respond-sync', payload)
        })


        socket.on('disconnecting', () => {
            const {rooms} = socket;
            for (const room_id of rooms) {
                if (room_id === socket.id) continue; // skip private room
                const userRemoved = STORE.popUser(room_id, socket.data.username, socket.id)

                if(userRemoved){ //Dont want to alert user left if just closed a tab
                    io.to(room_id).emit('member-event', {
                        type: 'member',
                        status: 'leave',
                        username: socket.data.username,
                        time: getDateTimeStr(),
                        memberStack: STORE.getUsers(room_id),
                        room_id,
                    });
                }

            }
        })


    });


}


async function validateUserAndJoinRoom(io: Server, userId: string, room_id: string, socket: Socket) {
    const roomId = parseInt(room_id)
    const {rows} = await dbPool.query('SELECT EXISTS (SELECT 1 FROM room_users WHERE user_id = $1 AND room_id = $2)', [userId, roomId])
    if (rows[0].exists) {
        const {username} = socket.data;
        if (socket.data?.activeRoom && socket.data.activeRoom != room_id) {
            const {activeRoom: oldRoom} = socket.data
            const userRemoved = STORE.popUser(oldRoom, socket.data.username, socket.id)

            if(userRemoved){
                io.to(oldRoom).emit('member-event', {
                    type: 'member',
                    status: 'leave',
                    username: username,
                    time: getDateTimeStr(),
                    memberStack: STORE.getUsers(oldRoom),
                    room_id: oldRoom
                })
            }

        }

        const newUser = STORE.addUser(room_id, socket.data.username, socket.id)
        // socket.join(room_id)
        socket.data.activeRoom = room_id;

        if (newUser) { //Do not want to alert new user if just opening a new tab
            io.to(room_id).emit('member-event', {
                type: 'member',
                status: 'join',
                username: username,
                time: getDateTimeStr(),
                memberStack: STORE.getUsers(room_id),
                room_id: room_id
            })
        }
        const memberStack = STORE.getUsers(room_id)
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


function getDateTimeStr() {
    return new Date().toISOString();
}