'use client'
import useRoomContext from "@/contexts/RoomProvider.tsx";
import {ChatRoomItem} from "@/app/components/ChatRoomItem.tsx";
import {useParams} from "next/navigation";

export default function ChatRoomList(){
    const {rooms} = useRoomContext()
    const params = useParams();
    const slug = params?.slug as string | undefined;

    return (
        <div className="divide-y divide-border flex-1 overflow-y-auto">
            {rooms.map(room => (
                <ChatRoomItem activeSlug={slug} room={room} key={room.id}/>
            ))}
        </div>

    )
}