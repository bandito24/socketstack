import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {ReactNode} from "react";
import {auth} from "../../../server/auth.ts";
import ReactQueryProvider from "@/contexts/ReactQueryProvider.tsx";
import {ChatSidebar} from "@/app/(auth)/rooms/ChatSidebar.tsx";
import {ChatRoom, mockChatRooms} from "@mytypes/next/chat.ts";
import {ChatWindow} from "@/app/(auth)/rooms/[slug]/ChatWindow.tsx";
import {RoomProvider} from "@/contexts/RoomProvider.tsx";

const initialChatRooms: ChatRoom[] = [
    {
        id: "1",
        name: "Design Team",
        lastMessage: "Let's review the wireframes tomorrow",
        timestamp: "2m ago",
        unreadCount: 3,
        avatarColor: "#6366f1",
        memberCount: 4,
        members: [
            {id: "u1", name: "Sarah Chen", avatarColor: "#f59e0b", isActive: true},
            {id: "u2", name: "Mike Johnson", avatarColor: "#10b981", isActive: true},
            {id: "u3", name: "You", avatarColor: "#6366f1", isActive: true},
            {id: "u4", name: "Amy Rodriguez", avatarColor: "#ec4899", isActive: false},
        ],
    },
    {
        id: "2",
        name: "Engineering Squad",
        lastMessage: "The deploy is complete ✅",
        timestamp: "15m ago",
        unreadCount: 0,
        avatarColor: "#8b5cf6",
        memberCount: 8,
        members: [
            {id: "u5", name: "Alex Rodriguez", avatarColor: "#8b5cf6", isActive: true},
            {id: "u6", name: "You", avatarColor: "#6366f1", isActive: true},
            {id: "u7", name: "David Kim", avatarColor: "#06b6d4", isActive: true},
            {id: "u8", name: "Rachel Green", avatarColor: "#f59e0b", isActive: true},
            {id: "u9", name: "Tom Wilson", avatarColor: "#ec4899", isActive: false},
            {id: "u10", name: "Sophie Turner", avatarColor: "#10b981", isActive: false},
            {id: "u11", name: "Jack Brown", avatarColor: "#8b5cf6", isActive: false},
            {id: "u12", name: "Olivia Smith", avatarColor: "#06b6d4", isActive: false},
        ],
    },
    {
        id: "3",
        name: "Marketing & Sales",
        lastMessage: "Q4 campaign looks promising!",
        timestamp: "1h ago",
        unreadCount: 7,
        avatarColor: "#ec4899",
        memberCount: 6,
        members: [
            {id: "u13", name: "Emma Davis", avatarColor: "#ec4899", isActive: true},
            {id: "u14", name: "You", avatarColor: "#6366f1", isActive: true},
            {id: "u15", name: "Chris Martinez", avatarColor: "#10b981", isActive: true},
            {id: "u16", name: "Laura White", avatarColor: "#f59e0b", isActive: false},
            {id: "u17", name: "Kevin Park", avatarColor: "#8b5cf6", isActive: false},
            {id: "u18", name: "Nina Patel", avatarColor: "#06b6d4", isActive: false},
        ],
    },
    {
        id: "4",
        name: "Product Managers",
        lastMessage: "Updated the roadmap doc",
        timestamp: "2h ago",
        unreadCount: 0,
        avatarColor: "#f59e0b",
        memberCount: 3,
        members: [
            {id: "u19", name: "James Wilson", avatarColor: "#f59e0b", isActive: true},
            {id: "u20", name: "You", avatarColor: "#6366f1", isActive: true},
            {id: "u21", name: "Maya Anderson", avatarColor: "#ec4899", isActive: false},
        ],
    },
    {
        id: "5",
        name: "Customer Success",
        lastMessage: "Great feedback from the client!",
        timestamp: "3h ago",
        unreadCount: 2,
        avatarColor: "#10b981",
        memberCount: 5,
        members: [
            {id: "u22", name: "Lisa Anderson", avatarColor: "#10b981", isActive: true},
            {id: "u23", name: "You", avatarColor: "#6366f1", isActive: true},
            {id: "u24", name: "Ryan Cooper", avatarColor: "#06b6d4", isActive: true},
            {id: "u25", name: "Jessica Lee", avatarColor: "#ec4899", isActive: false},
            {id: "u26", name: "Mark Thompson", avatarColor: "#8b5cf6", isActive: false},
        ],
    },
    {
        id: "6",
        name: "Random",
        lastMessage: "Anyone up for lunch?",
        timestamp: "5h ago",
        unreadCount: 0,
        avatarColor: "#06b6d4",
        memberCount: 12,
        members: [
            {id: "u27", name: "Chris Martinez", avatarColor: "#06b6d4", isActive: true},
            {id: "u28", name: "You", avatarColor: "#6366f1", isActive: true},
            {id: "u29", name: "Sarah Chen", avatarColor: "#f59e0b", isActive: true},
            {id: "u30", name: "Alex Rodriguez", avatarColor: "#8b5cf6", isActive: true},
            {id: "u31", name: "Emma Davis", avatarColor: "#ec4899", isActive: true},
            {id: "u32", name: "James Wilson", avatarColor: "#f59e0b", isActive: true},
            {id: "u33", name: "Lisa Anderson", avatarColor: "#10b981", isActive: false},
            {id: "u34", name: "Mike Johnson", avatarColor: "#10b981", isActive: false},
            {id: "u35", name: "David Kim", avatarColor: "#06b6d4", isActive: false},
            {id: "u36", name: "Rachel Green", avatarColor: "#f59e0b", isActive: false},
            {id: "u37", name: "Tom Wilson", avatarColor: "#ec4899", isActive: false},
            {id: "u38", name: "Sophie Turner", avatarColor: "#10b981", isActive: false},
        ],
    },
];


export default async function AuthLayout({children}: { children: ReactNode }) {


    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
    if (!session) {
        redirect('/login')
    }

    return (
        <>


            <RoomProvider>
                    <div className="flex-1 flex overflow-hidden">
                        <div className="w-80 flex flex-col">
                            <ChatSidebar
                                rooms={mockChatRooms}
                            />
                        </div>
                        {/*<div className="flex-1 h-full">*/}
                        {/*    <ChatWindow*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {children}
                    </div>
            </RoomProvider>
        </>
    )
}