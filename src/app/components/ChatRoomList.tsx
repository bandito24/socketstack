'use client'
import useRoomContext from "@/contexts/RoomProvider.tsx";
import {ChatRoomItem} from "@/app/components/ChatRoomItem.tsx";

export default function ChatRoomList(){
    const {rooms} = useRoomContext()

    return (
        <div className="divide-y divide-border">
            {rooms.map(room => (
                <ChatRoomItem room={room} key={room.id}/>
            ))}
        </div>

    )
}