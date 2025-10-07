'use client'


import useRoomContext from "@/contexts/RoomProvider.tsx";
import {useQueryClient} from "@tanstack/react-query";

export default function RoomList(){
    const {rooms} = useRoomContext()


    return (
        <div>
            <h2 className="bold text-xl">Rooms</h2>
            <ul>
                {rooms.map(room => (
                    <li key={room.id}>{room.name}</li>
                ))}
            </ul>

        </div>
    )
}