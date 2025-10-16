export interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
}

export interface Member {
    id: string;
    name: string;
    avatarColor: string;
    isActive: boolean;
}

export interface ChatRoom {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    avatarColor: string;
    memberCount: number;
    members: Member[];
}


export const mockMembers: Member[] = [
    {
        id: 'u001',
        name: 'Alice Thompson',
        avatarColor: '#E57373', // soft red
        isActive: true,
    },
    {
        id: 'u002',
        name: 'Brandon Lee',
        avatarColor: '#64B5F6', // blue
        isActive: false,
    },
    {
        id: 'u003',
        name: 'Chloe Nguyen',
        avatarColor: '#81C784', // green
        isActive: true,
    },
    {
        id: 'u004',
        name: 'Diego Ramirez',
        avatarColor: '#BA68C8', // purple
        isActive: true,
    },
    {
        id: 'u005',
        name: 'Ella Johnson',
        avatarColor: '#FFD54F', // yellow
        isActive: false,
    },
];


export const mockMessages: Message[] = [
    {
        id: 'm001',
        sender: 'u001', // Alice Thompson
        content: "Hey everyone 👋 just pushed the new feature to staging!",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
    },
    {
        id: 'm002',
        sender: 'u003', // Chloe Nguyen
        content: "Nice work Alice! I’ll test it after lunch 🍜",
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 min ago
    },
    {
        id: 'm003',
        sender: 'u004', // Diego Ramirez
        content: "FYI, the map rendering issue is fixed on dev branch.",
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 min ago
    },
    {
        id: 'm004',
        sender: 'u002', // Brandon Lee
        content: "Can someone review my PR for the new color picker? 🎨",
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 min ago
    },
    {
        id: 'm005',
        sender: 'u001', // Alice again
        content: "Yep, on it now!",
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8 min ago
    },
];

export const mockChatRooms: ChatRoom[] = [
    {
        id: 'r001',
        name: 'Development Chat',
        lastMessage: 'Yep, on it now!',
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8 min ago
        unreadCount: 2,
        avatarColor: '#64B5F6', // blue
        memberCount: 4,
        members: mockMembers.slice(0, 4), // Alice, Brandon, Chloe, Diego
    },
    {
        id: 'r002',
        name: 'Design Team',
        lastMessage: 'The new icon set looks awesome ✨',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
        unreadCount: 0,
        avatarColor: '#BA68C8', // purple
        memberCount: 3,
        members: mockMembers.slice(2, 5), // Chloe, Diego, Ella
    },
    {
        id: 'r003',
        name: 'Marketing Sync',
        lastMessage: 'Meeting starts in 5 minutes ⏰',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
        unreadCount: 5,
        avatarColor: '#81C784', // green
        memberCount: 2,
        members: mockMembers.slice(1, 3), // Brandon, Chloe
    },
];


