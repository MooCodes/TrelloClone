import { Router } from "express";
import {
  createBoard,
  getBoards,
  addUserToBoard,
  updateBoard,
} from "../controllers/boardController";
import auth from "../middleware/auth";

const router = Router();

router.post("/", auth, createBoard);
router.get("/", auth, getBoards);

router.post("/:boardId/addUser", auth, addUserToBoard);
router.put("/:boardId", auth, updateBoard);

export default router;
