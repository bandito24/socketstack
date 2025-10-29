'use client'
import useRoomContext, {Room} from "@/contexts/RoomProvider.tsx";
import {ChatRoomItem} from "@/app/(auth)/rooms/ChatRoomItem.tsx";
import {useParams} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import useSocketProvider from "@/contexts/SocketProvider.tsx";
import {MessageIOEvent, ServerToClientEvents} from "@mytypes/IOTypes.ts";
import {BaseClockProvider} from "@/contexts/BaseClockProvider.tsx";

type RoomId = number | string;

export type RoomPreview = {
    stackCount: number;
    lastMessage: MessageIOEvent | null;
    unreadMessageCount: number
};

type RoomPreviewState = Record<RoomId, RoomPreview>;
const emptyPreview: RoomPreview = {stackCount: 0, lastMessage: null, unreadMessageCount: 0};


export default function ChatRoomList({rooms}: {rooms: Room[]}) {


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
                if (!(room.id in next)) {
                    next[room.id] = {stackCount: 0, lastMessage: null, unreadMessageCount: 0};
                }
            }
            return next;
        });
    }, [rooms]);
    useEffect(() => {
        activeRoomRef.current = (rooms.find(room => room.slug === (slug ?? '')))
    }, [slug, rooms])


    const setPreviewRead = (roomId: RoomId) => {
        if (!(roomId in roomPreviews)) return
        const updated = {...roomPreviews[roomId]}
        updated.unreadMessageCount = 0
        setRoomPreviews(prev => ({...prev, [roomId]: updated}))
    }


    function updateRoomPreviewState(
        roomId: string,
        stackCount: number,
        lastMessage: MessageIOEvent | null = null
    ) {
        setRoomPreviews(prev => {

            const preview = prev[roomId] ?? emptyPreview;
            return {
                ...prev,
                [roomId]: {
                    stackCount,
                    lastMessage: lastMessage ?? preview.lastMessage,
                    unreadMessageCount: lastMessage && parseInt(roomId) !== activeRoomRef.current?.id ?
                        preview.unreadMessageCount + 1 :
                        preview.unreadMessageCount
                }
            };
        });
    }

    const handleMemberEvent: ServerToClientEvents['member-event'] = (payload) => {
        updateRoomPreviewState(payload.room_id, payload.memberStack.length)
    }
    const handleMessageEvent: ServerToClientEvents['msg-event'] = payload => {

        updateRoomPreviewState(payload.room_id, payload.stackCount, payload)
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
                    <ChatRoomItem
                        roomPreview={roomPreviews[room.id] ?? emptyPreview}
                        indicateRead={() => setPreviewRead(room.id)}
                        activeSlug={activeRoomRef?.current?.slug} room={room} key={room.id}/>
                ))}
            </div>
        </BaseClockProvider>

    )
}