import dotenv from "dotenv";
dotenv.config();

import express from "express";
import next from "next";
import http from "node:http";

import { apiRouter } from "./server/routes/index.ts";
import { initIO } from "#root/server/io/socket.ts";
import { registerSocketHandlers } from "#root/server/io/index.ts";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, turbo: true });
const handle = nextApp.getRequestHandler();

const expressServer = express();
const httpServer = http.createServer(expressServer);

// Core Express middleware
expressServer.use(express.json());
expressServer.use("/api", apiRouter);



// Pass any non-API routes to Next.js
expressServer.all(/(.*)/, (req, res) => handle(req, res));

// Prepare Next.js, then init IO and start server
nextApp.prepare().then(async () => {
  const io = await initIO(httpServer);
  registerSocketHandlers(io);

  httpServer.listen(3000, () => {
    console.log("✅ Server running at http://localhost:3000");
  });
});

// Global error handler
expressServer.use((err, req, res, next) => {
  console.error("💥 Error caught by final handler:", err);
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  if (process.env.NODE_ENV === "production" && status === 500) {
    return res.status(500).json({ error: "Something went wrong" });
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});
