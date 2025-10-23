'use client'
import useRoomContext from "@/contexts/RoomProvider.tsx";
import {ChatRoomItem} from "@/app/components/ChatRoomItem.tsx";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import useSocketProvider from "@/contexts/SocketProvider.tsx";
import {ServerToClientEvents} from "@mytypes/IOTypes.ts";

type RoomId = number | string;

export type RoomPreview = {
    stackCount: number;
    lastMessage: string | null;
    unread: boolean;
};

type RoomPreviewState = Record<RoomId, RoomPreview>;
const emptyPreview: RoomPreview = { stackCount: 0, lastMessage: null, unread: true };


export default function ChatRoomList() {



    const {clientSocket: socket} = useSocketProvider()
    const {rooms} = useRoomContext()
    const params = useParams();
    const slug = params?.slug as string | undefined;
    const [roomPreviews, setRoomPreviews] = useState<RoomPreviewState>(
        Object.fromEntries(
            rooms.map(val => [
                val.id,
                { stackCount: 0, lastMessage: null, unread: true }
            ])
        )
    );

    const setPreviewRead = (roomId: RoomId) => {
        if(!(roomId in roomPreviews)) return
        const updated = {...roomPreviews[roomId]}
        updated.unread = false
        setRoomPreviews(prev => ({...prev, [roomId]: updated}))
    }




    function updateRoomPreviewState(
        roomId: string,
        stackCount: number,
        lastMessage: string | null = null
    ) {
        setRoomPreviews(prev => {
            const preview = prev[roomId] ?? emptyPreview;
            return {
                ...prev,
                [roomId]: {
                    stackCount,
                    lastMessage: lastMessage ?? preview.lastMessage,
                    unread: true
                }
            };
        });
    }

    const handleMemberEvent: ServerToClientEvents['member-event'] = (payload) => {
        updateRoomPreviewState(payload.room_id, payload.memberStack.length)
    }
    const handleMessageEvent: ServerToClientEvents['msg-event'] = payload => {
        updateRoomPreviewState(payload.room_id, payload.stackCount, payload.content)
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
        <div className="divide-y divide-border flex-1 overflow-y-auto">
            {rooms.map(room => (
                <ChatRoomItem
                    roomPreview={roomPreviews[room]}
                    set
                    activeSlug={slug} room={room} key={room.id}/>
            ))}
        </div>

    )
}