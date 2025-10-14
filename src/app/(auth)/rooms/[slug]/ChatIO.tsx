'use client'

import {useEffect, useRef, useState} from "react";
import ChatMessages from "@/app/(auth)/rooms/[slug]/ChatMessages.tsx";
import ChatInput from "@/app/(auth)/rooms/[slug]/ChatInput.tsx";
import {Room} from "@/contexts/RoomProvider.tsx";
import {authClient} from "@/lib/auth-client.ts";
import {ClientToServerEvents, RespondSync, RoomEvent, ServerToClientEvents} from '@mytypes/IOTypes.ts';
import MakeNotification from "@/utils/MakeNotification.ts";
import {Badge} from "@/components/ui/badge.tsx";
import useSocketProvider from "@/contexts/SocketProvider.tsx";


export default function ChatIO({room}: { room: Room }) {

    const [isConnected, setIsConnected] = useState(false);
    const [roomEvents, setRoomEvents] = useState<RoomEvent[]>([])
    const [memberStack, setMemberStack] = useState<string[]>([])
    const syncRef = useRef<boolean>(false)
    const ROOM_ID = room.id.toString()
    const roomEventRef = useRef<RoomEvent[]>([])
    const {data: session} = authClient.useSession()
    const {clientSocket: socket, setClientSocket} = useSocketProvider()


    useEffect(()=> {
        roomEventRef.current = roomEvents
    },[roomEvents])


    function onSend(content: string) {
        if (!socket) {
            console.warn("Socket not connected — cannot send message yet.");
            return;
        }
        socket.emit('msg', {room_id: ROOM_ID, msg: content})
    }

    useEffect(() => {
        if (!socket) return






        const handleConnect = () => {
            socket.emit("request-room", {room_id: ROOM_ID});
        };
        if (socket.connected) {
            handleConnect();
        }


        function handleRequestRoom(ack) {
            const {success} = ack
            if (ack?.memberStack) {
                setMemberStack(ack.memberStack)
            }
            if (success) {
                setIsConnected(true)
            } else {
                MakeNotification.alertFailed('')
            }
        }

        function handleExteriorRoomEvent(payload: { room_id: string }) {
            console.log('EXTERIOR ROOM EVENT')
            // console.log(payload)
            // console.log('123')
        }


        function handleRoomEvent(payload: RoomEvent) {
            if (payload.room_id !== ROOM_ID) {
                return handleExteriorRoomEvent(payload)
            }

            if (payload.type === 'member') {
                setMemberStack(payload.memberStack)
            }
            setRoomEvents(prev => [...prev, payload])
        }

        function handleNotify(payload) {
            if (payload.room_id !== ROOM_ID) {
                return handleExteriorRoomEvent(payload)
            }
        }

        function handleRequestSync(payload) {

            if (payload.room_id !== ROOM_ID) {
                return handleExteriorRoomEvent(payload)
            }
            const events = roomEventRef.current;


            let msgs = events.filter(val => val.type === 'msg')
            if (msgs.length > 10) msgs = msgs.slice(-10)

            const response = {data: msgs, socketId: payload.socketId, room_id: ROOM_ID}
            if (socket) {
                socket.emit('respond-sync', response)
                console.log('request sync emitted', response)            }
        }

        function handleRespondSync(payload: RespondSync) {
            if(syncRef.current === true) return

            console.log('response sync received', payload)
            if (payload.room_id !== ROOM_ID) {
                return handleExteriorRoomEvent(payload)
            }
            setRoomEvents(prev => [...payload.data, ...prev])
            syncRef.current = true
        }

        function handleDisconnect() {
            setIsConnected(false)
        }


        socket.on("request-room", handleRequestRoom);
        socket.on("room-event", handleRoomEvent);
        socket.on("notify", handleNotify);
        socket.on("disconnect", handleDisconnect);
        socket.on("request-sync", handleRequestSync);
        socket.on("respond-sync", handleRespondSync);


        return () => {
            socket.off("request-room", handleRequestRoom);
            socket.off("room-event", handleRoomEvent);
            socket.off("notify", handleNotify);
            socket.off("disconnect", handleDisconnect);
            socket.off("request-sync", handleRequestSync);
            socket.off("respond-sync", handleRespondSync);
        };
    }, [session, ROOM_ID, socket]);


    return (
        <>
            <div className="flex w-full">
                {memberStack.map(user => (
                    <Badge variant={'default'} key={user}>{user}</Badge>
                ))}
            </div>
            <h1 className={`text-2xl font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? "You're in!" : "403 – Access Denied"}
            </h1>
            <ChatMessages username={session?.user.username ?? ''} roomEvents={roomEvents}/>
            <ChatInput onSend={onSend} room={room}/>
        </>
    )
}