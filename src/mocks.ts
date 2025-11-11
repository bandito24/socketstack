import {MemberEvent, MessageIOEvent} from "@mytypes/IOTypes.ts";
import {RoomPreview} from "@/app/(auth)/rooms/ChatRoomList.tsx";

export const mockUser = () => ({
    id: "user_123",
    email: "testuser@example.com",
    name: "Test User",
    createdAt: new Date("2023-01-01").toISOString(),
    updatedAt: new Date("2023-01-01").toISOString(),
    avatar_color: "#6D28D9", // indigo-700
    emailVerified: true,
    image: "https://example.com/avatar.png",
    username: "testuser",
    displayUsername: "@testuser",
});
export const mockRoom = () => ({
    id: 101,
    slug: "general-chat",
    name: "General Chat",
    avatar_color: "#6366f1",
    total_members: 12,
    description: "A place for general discussion about anything.",
});

export const mockHookForm = () => ({reset: vi.fn(), setValue: vi.fn(), setError: vi.fn()});


export const mockMessageIOEvent = (): MessageIOEvent =>  ({
    room_id: "123",
    type: "msg",
    content: "Hello world!",
    username: "Charlie",
    time: new Date().toISOString(),
    stackCount: 3,
});
export const mockMemberEvent = (): MemberEvent => ({
    type: "member",
    status: "join",
    username: "Charlie",
    time: new Date().toISOString(),
    room_id: "101",
    memberStack: ["Charlie", "Alex", "Sam"],
});
export const mockEmptyRoomPreview =  (): RoomPreview => ({
    stackCount: 0,
    lastMessage: null,
    unreadMessageCount: 0,
})




export const mockRooms = [
    {
        id: 1,
        slug: "123",
        name: "123",
        avatar_color: "#3B82F6", // Tailwind blue-500
        total_members: 42,
        description: "Discuss all things 123.",
    },
    {
        id: 2,
        slug: "embedded-systems",
        name: "Embedded Systems",
        avatar_color: "#22C55E", // green-500
        total_members: 17,
        description: "ESP32, STM32, and microcontrollers in general.",
    },
    {
        id: 3,
        slug: "node-backend",
        name: "Node Backend",
        avatar_color: "#F59E0B", // amber-500
        total_members: 58,
        description: "Backend engineering, APIs, and architecture.",
    },
    {
        id: 4,
        slug: "ai-lab",
        name: "AI Lab",
        avatar_color: "#A855F7", // violet-500
        total_members: 29,
        description: "Experiments with GPT, LangChain, and AI research tools.",
    },
];
export const oneMoreMockRoom = {
    id: 6,
    slug: "illegal-activities",
    name: "illegal activities",
    avatar_color: "#22C55E", // green-500
    total_members: 32,
    description: "First rule of fight club",
}



