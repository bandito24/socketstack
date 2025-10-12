'use client'

import {useEffect, useState} from "react";
import ChatMessages from "@/app/(auth)/rooms/[slug]/ChatMessages.tsx";
import ChatInput from "@/app/(auth)/rooms/[slug]/ChatInput.tsx";
import {Room} from "@/contexts/RoomProvider.tsx";
import {authClient} from "@/lib/auth-client.ts";
import {io, Socket} from "socket.io-client";
import {ClientToServerEvents, RoomEvent, ServerToClientEvents} from '@mytypes/IOTypes.ts';
import MakeNotification from "@/utils/MakeNotification.ts";



export default function ChatIO({room}: { room: Room }) {
    const [isConnected, setIsConnected] = useState(false);
    const [clientSocket, setClientSocket] = useState<null | Socket<ServerToClientEvents, ClientToServerEvents>>(null)
    const [roomEvents, setRoomEvents] = useState<RoomEvent[]>([])
    const ROOM_ID = room.id.toString()
    const {data: session} = authClient.useSession()
    console.log(session)


    function onSend(content: string){
        if (!clientSocket) {
            console.warn("Socket not connected — cannot send message yet.");
            return;
        }
        clientSocket.emit('msg', {room_id: ROOM_ID, msg: content})
    }

    useEffect(() => {
        if (!session) return

        const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
            auth: {
                token: session.user.id
            }
        });
        socket.connect();
        setClientSocket(socket)
        socket.on("connect", () => {
            setIsConnected(true)
            socket.emit('request-room', {room_id: ROOM_ID})
        });
        socket.on('request-room', (ack) => {
            const {success} = ack
            if(success){
                setIsConnected(true)
            } else {
                MakeNotification.alertFailed('')
            }
        })

        socket.on('room-event', (payload) => {
            setRoomEvents(prev => [...prev, payload])
        })


        socket.on('disconnect', () => {
            setIsConnected(false)
        })


        return () => {
            socket.off("connect")
            socket.disconnect();
        };
    }, [session, room.id]);


    return (
        <>
            <h1 className={`text-2xl font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? "You're in!" : "403 – Access Denied"}
            </h1>
            <ChatMessages username={session?.user.username ?? ''} roomEvents={roomEvents}/>
            <ChatInput onSend={onSend} room={room}/>
        </>
    )
}