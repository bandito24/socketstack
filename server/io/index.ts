import type { Server } from "socket.io";

export function registerSocketHandlers(io: Server) {
    io.on("connection", (socket) => {
        console.log("🟢 Client connected:", socket.id);

        // Attach feature handlers here
        // chatHandler(socket);
        // roomHandler(socket);

        socket.emit("bar", "123");
    });
}