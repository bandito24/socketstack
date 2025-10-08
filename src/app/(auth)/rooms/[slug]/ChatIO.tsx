'use client'

import {useEffect, useState} from "react";
import {socket} from "@/lib/socket.ts";
import ChatMessages from "@/app/(auth)/rooms/[slug]/ChatMessages.tsx";
import ChatInput from "@/app/(auth)/rooms/[slug]/ChatInput.tsx";
import {Room} from "@/contexts/RoomProvider.tsx";

export default function ChatIO({room}: {room: Room}){
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [fooEvents, setFooEvents] = useState([]);

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            console.log("🟢 Connected to server:", socket.id);
        });

        socket.on("bar", (data) => {
            console.log("📦 Got 'bar' event from server:", data);
        });

        return () => {
            socket.off("bar");
            socket.disconnect();
        };
    }, []);


    return (
        <>
        <ChatMessages room={room}/>
        <ChatInput room={room}/>
        </>
    )
}