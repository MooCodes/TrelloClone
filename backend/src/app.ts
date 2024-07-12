import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import http from "http";
import { Server } from "socket.io";
import userRouter from "./routes/userRoutes";
import boardRouter from "./routes/boardRoutes";
import listRouter from "./routes/listRoutes";
import cardRouter from "./routes/cardRoutes";

const app = express();
export const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

connectDB();

io.on("connection", (socket) => {
  console.log("a user connected, socket id: ", socket.id);

  socket.join("test");

  socket.on("joinRoom", async (boardId) => {
    console.log("joining board: ", boardId);
    socket.join(boardId);
  });

  socket.on("refreshLists", (boardId) => {
    console.log("refreshing list for board: ", boardId);

    const clients = io.sockets.adapter.rooms.get(boardId);
    console.log(clients);

    // io.to(boardId).emit("refreshLists");

    // send to all clients in the room except the sender
    clients!.forEach((socketId) => {
      if (socket.id !== socketId) {
        console.log("sending refreshLists to: ", socketId);
        io.to(socketId).emit("refreshLists");
      } else {
        console.log("not sending refreshLists to: ", socketId);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/boards", boardRouter);
app.use("/api/lists", listRouter);
app.use("/api/cards", cardRouter);

export default app;
