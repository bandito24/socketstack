import "express";

type RoomType = {name: string, password: string | null, slug: string, id: number, createdAt: string}

declare global {
    namespace Express {
        interface User {
            id: string;
            email: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            emailVerified: boolean;
            image?: string | null;
            username?: string | null;
            displayUsername?: string | null;
        }

        interface Request {
            user?: User | null;
            room?: RoomType | null
            room_id?: {room_id: number}
        }
    }
}