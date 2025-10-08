'use client'


import useRoomContext from "@/contexts/RoomProvider.tsx";
import {useQueryClient} from "@tanstack/react-query";
import Link from "next/link";

export default function RoomList(){
    const {rooms} = useRoomContext()


    return (
        <div>
            <h2 className="font-bold text-xl mb-3">Rooms</h2>
            <ul className="space-y-2">
                {rooms.map((room) => (
                    <li key={room.id}>
                        <Link
                            href={`/rooms/${room.slug}`}
                            className="block rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-[0.98]"
                        >
                            <span className="text-gray-800 font-medium">{room.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}