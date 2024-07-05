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
const server = http.createServer(app);
const io = new Server(server);

connectDB();

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinBoard", (boardId) => {
    socket.join(boardId);
  });

  socket.on("addList", (list) => {
    socket.to(list.board._id).emit("listAdded", list);
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
