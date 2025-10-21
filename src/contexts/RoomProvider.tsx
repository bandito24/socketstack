'use client'


import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import ServerRequest from "@/utils/serverRequest.ts";

export type Room = {
    id: number,
    slug: string,
    name: string,
    avatar_color: string,
    notification_count?: 0;
    total_members: number
}

type RoomContextType = {
    rooms: Room[]
    setRooms: React.Dispatch<React.SetStateAction<Room[]>>
}




const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({children}: {children: ReactNode}){
    const [rooms, setRooms] = useState<Room[]>([])





    const { data } = useQuery({
        queryKey: ['rooms'],
        queryFn: async () => {
            const res = await ServerRequest.get('/rooms');
            return res;
        },
    });
    useEffect(()=> {
        if (data) {
            setRooms(data);
        }
    }, [data])
    return (
        <RoomContext.Provider value={{rooms, setRooms}}>
            {children}
        </RoomContext.Provider>
    )
}
export default function useRoomContext(){
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error('useRoomContext must be used within a RoomProvider');
    }
    return context;

}