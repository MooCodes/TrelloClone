import { Router } from "express";
import {
  createBoard,
  getBoards,
  getBoard,
  addUserToBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/boardController";
import auth from "../middleware/auth";

const router = Router();

router.post("/", auth, createBoard);
router.get("/", auth, getBoards);
router.get("/:boardId", auth, getBoard);
router.post("/:boardId/users", auth, addUserToBoard);
router.put("/:boardId", auth, updateBoard);
router.delete("/:boardId", auth, deleteBoard);

export default router;
