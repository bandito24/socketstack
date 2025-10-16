import {Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {ChatRoomItem} from "@/app/components/ChatRoomItem.tsx";
import {Room} from "@/contexts/RoomProvider.tsx";
import {ChatRoom} from "@mytypes/next/chat.ts";
import {CreateChatroom} from "@/app/(auth)/rooms/CreateChatRoom.tsx";
import {JoinChatroom} from "@/app/(auth)/rooms/JoinChatRoom.tsx";
import ChatRoomList from "@/app/components/ChatRoomList.tsx";



export function ChatSidebar({rooms}: {rooms: ChatRoom[]}) {


    return (
        <div className="border-r border-border flex flex-col bg-card">
            <div className="p-4 border-b border-border">
                <h2 className="mb-4">Messages</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input
                        placeholder="Search chats..."
                        className="pl-9"
                    />
                </div>
                <div className="flex flex-col mt-2 gap-2">
                    <CreateChatroom />
                    <JoinChatroom />
                </div>
            </div>

            <ScrollArea className="flex-1">
               <ChatRoomList />
            </ScrollArea>
        </div>
    );
}
