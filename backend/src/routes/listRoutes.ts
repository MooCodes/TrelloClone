import { Router } from "express";
import {
  createList,
  deleteList,
  getLists,
  updateList,
  moveList,
} from "../controllers/listController";
import auth from "../middleware/auth";

const router = Router();

router.post("/:boardId", auth, createList);
router.get("/:boardId", auth, getLists);
router.put("/:listId", auth, updateList);
router.patch("/:sourceListId", auth, moveList);
router.delete("/:listId", auth, deleteList);

export default router;
