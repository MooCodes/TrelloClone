import { Router } from "express";
import { createList } from "../controllers/listController";
import auth from "../middleware/auth";

const router = Router();

router.post("/:boardId", auth, createList);

export default router;