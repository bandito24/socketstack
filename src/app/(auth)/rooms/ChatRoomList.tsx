'use client'
import useRoomContext, {Room} from "@/contexts/RoomProvider.tsx";
import {ChatRoomItem} from "@/app/(auth)/rooms/ChatRoomItem.tsx";
import {useParams} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import useSocketProvider from "@/contexts/SocketProvider.tsx";
import {MemberEvent, MessageIOEvent, ServerToClientEvents} from "@mytypes/IOTypes.ts";
import {BaseClockProvider} from "@/contexts/BaseClockProvider.tsx";

type RoomId = string;

export type RoomPreview = {
    stackCount: number;
    lastMessage: MessageIOEvent | null;
    unreadMessageCount: number
};

type RoomPreviewState = Record<RoomId, RoomPreview>;
const emptyPreview: RoomPreview = {stackCount: 0, lastMessage: null, unreadMessageCount: 0};


export default function ChatRoomList({rooms}: { rooms: Room[] }) {


    const {clientSocket: socket} = useSocketProvider()
    const activeRoomRef = useRef<Room | undefined>(undefined)
    const params = useParams();
    const slug = params?.slug as string | undefined;


    const [roomPreviews, setRoomPreviews] = useState<RoomPreviewState>({});
    useEffect(() => {
        if (!rooms.length) return;
        setRoomPreviews(prev => {
            const next = {...prev};
            for (const room of rooms) {
                const roomId = room.id.toString()
                if (!(roomId in next)) {
                    next[roomId] = {stackCount: 0, lastMessage: null, unreadMessageCount: 0};
                }
            }
            return next;
        });
    }, [rooms]);
    useEffect(() => {
        activeRoomRef.current = (rooms.find(room => room.slug === (slug ?? '')))
    }, [slug, rooms])


    const setPreviewRead = (roomId: RoomId) => {
        if (!roomId || !(roomId in roomPreviews)) return
        const updated = {...roomPreviews[roomId]}
        updated.unreadMessageCount = 0
        setRoomPreviews(prev => ({...prev, [roomId]: updated}))
    }

    function handleRoomPreviewState(payload: MessageIOEvent | MemberEvent) {
        const updatedRoomPreview = updateRoomPreview(
            payload,
            activeRoomRef?.current?.id.toString() ?? '-1',
            roomPreviews[payload.room_id] ?? emptyPreview)
        setRoomPreviews(prev => ({...prev, [payload.room_id]: updatedRoomPreview}))
    }


    const handleMemberEvent: ServerToClientEvents['member-event'] = (payload) => {
        handleRoomPreviewState(payload)
    }
    const handleMessageEvent: ServerToClientEvents['msg-event'] = payload => {
        handleRoomPreviewState(payload)
    }


    useEffect(() => {
        if (!socket) return

        socket.on("member-event", handleMemberEvent);
        socket.on("msg-event", handleMessageEvent);
        return () => {
            socket.off('member-event', handleMemberEvent)
            socket.off('msg-event', handleMessageEvent)
        }

    }, [socket])


    return (
        <BaseClockProvider>
            <div className="divide-y divide-border flex-1 overflow-y-auto">
                {rooms.map(room => (
                    <div key={room.id} data-testid={`chatroom-item-${room.id}`}>
                        <ChatRoomItem

                            roomPreview={roomPreviews[room.id] ?? emptyPreview}
                            indicateRead={() => setPreviewRead(room.id.toString())}
                            activeSlug={activeRoomRef?.current?.slug} room={room}/>
                    </div>
                ))}
            </div>
        </BaseClockProvider>

    )
}


export function updateRoomPreview(
    payload: MessageIOEvent | MemberEvent,
    activeRoomId: string | null,
    currentRoomPreview: RoomPreview
) {
    const isMsgType = payload.type === 'msg'
    const roomPreview = {...currentRoomPreview}
    roomPreview.stackCount = isMsgType ? payload.stackCount : payload.memberStack.length
    if (isMsgType) {
        roomPreview.lastMessage = payload
    }
    if (activeRoomId && payload.room_id !== activeRoomId && isMsgType) {
        roomPreview.unreadMessageCount += 1
    }
    return roomPreview
}