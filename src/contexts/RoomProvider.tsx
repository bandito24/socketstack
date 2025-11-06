'use client'


import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import ServerRequest from "@/utils/serverRequest.ts";
import {z} from "zod";

export const RoomSchema = z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
    avatar_color: z.string(),
    total_members: z.number().optional(),
    description: z.string().optional(),
});

export type Room = z.infer<typeof RoomSchema>

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
            const res = await ServerRequest.get('/rooms?stack=true');
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