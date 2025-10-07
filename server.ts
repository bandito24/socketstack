// Express + Next JS server combination - server.js

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import next from "next";
import {apiRouter} from "./server/routes/index.ts";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, turbo: true });
const handle = app.getRequestHandler();
const server = express();



console.log("DB Config:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

//API entrypoint

server.use(express.json());
server.use("/api", apiRouter);


server.all(/(.*)/, (req, res) => {
  return handle(req, res);
});

app.prepare().then(() => {
  // Start listening to the Express.js Server
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("Express Server running on http://localhost:3000");
  });
});


server.use((err, req, res, next) => {
  console.error('💥 Error caught by final handler:', err);

  // normalize to a consistent shape
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  // optional: hide internal details in production
  if (process.env.NODE_ENV === 'production' && status === 500) {
    return res.status(500).json({ error: 'Something went wrong' });
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});
