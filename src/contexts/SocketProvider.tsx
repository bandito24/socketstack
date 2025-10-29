'use client'
import {io, Socket} from "socket.io-client";
import {ClientToServerEvents, ServerToClientEvents} from "@mytypes/IOTypes.ts";
import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {authClient} from "@/lib/auth-client.ts";
import useRoomContext from "@/contexts/RoomProvider.tsx";

type SocketContextType = {
    clientSocket: null | Socket<ServerToClientEvents, ClientToServerEvents>,
    setClientSocket: React.Dispatch<React.SetStateAction<null | Socket<ServerToClientEvents, ClientToServerEvents>>>
}

const SocketContext = createContext<SocketContextType | null>(null)

export function SocketProvider({children}: {children: ReactNode}){
    const [clientSocket, setClientSocket] = useState<null | Socket<ServerToClientEvents, ClientToServerEvents>>(null)
    const {data: session} = authClient.useSession()
    const {rooms} = useRoomContext();

    useEffect(()=> {
        if (!session) return

        const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
            auth: {
                token: session.user.id
            }
        });
        socket.connect();



        const handleConnect = () => setClientSocket(socket)
        const handleDisconnect = () => setClientSocket(null)

        socket.on('connect', handleConnect)
        socket.on('disconnect', handleDisconnect)

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.disconnect();
        }

    }, [session, rooms])



    return (
        <SocketContext.Provider value={{clientSocket, setClientSocket}}>
            {children}
        </SocketContext.Provider>

    )
}

export default function useSocketProvider(){
    const context = useContext(SocketContext)
    if(!context) throw new Error('must use socket context within appropriate provider')
    return context
}

