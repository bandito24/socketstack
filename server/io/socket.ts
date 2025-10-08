import type {Server} from "socket.io";

let io: Server | null = null;

export async function initIO(server: any) {
    const {Server} = await import("socket.io");
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
        },
    });
    return io;
}

export function getIO() {
    if (!io) throw new Error("Socket.IO not initialized yet!");
    return io;
}