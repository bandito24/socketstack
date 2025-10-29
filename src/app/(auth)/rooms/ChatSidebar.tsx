'use client'
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {CreateChatroom} from "@/app/(auth)/rooms/CreateChatRoom.tsx";
import {JoinChatroom} from "@/app/(auth)/rooms/JoinChatRoom.tsx";
import ChatRoomList from "@/app/(auth)/rooms/ChatRoomList.tsx";
import useRoomContext, {Room} from "@/contexts/RoomProvider.tsx";
import {useEffect, useState} from "react";


export function ChatSidebar() {
    const [roomSearch, setRoomSearch] = useState<string>("")
    const [matchedRooms, setMatchedRooms] = useState<Room[]>([])


    const {rooms: allRooms} = useRoomContext()

    useEffect(()=> {
        const search = roomSearch?.trim()?.toLowerCase()
        if(!search){
            setMatchedRooms(allRooms)
        } else {
            const filtered = allRooms.filter(room => room.name.toLowerCase().indexOf(search) === 0)
            setMatchedRooms(filtered)
        }
    }, [allRooms, roomSearch])


    return (

            <div className="border-r border-border flex flex-1 flex-col bg-card overflow-hidden">
                <div className="p-4 border-b border-border">
                    <h2 className="mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="Search chats..."
                            className="pl-9"
                            onChange={(e)=> setRoomSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col mt-2 gap-2">
                        <CreateChatroom btnVariant={'sidebar'}/>
                        <JoinChatroom btnVariant={'sidebar'}/>
                    </div>
                </div>


                <ScrollArea className="flex-1 overflow-y-scroll">
                    <ChatRoomList rooms={matchedRooms}/>
                </ScrollArea>
            </div>

    );
}
