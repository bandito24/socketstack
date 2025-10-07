import "express";

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
        }
    }
}