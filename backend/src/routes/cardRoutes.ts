import { Router } from "express";
import { createCard, deleteCard, getCards, updateCard } from "../controllers/cardController";
import auth from "../middleware/auth";

const router = Router();

router.post("/:listId", auth, createCard);
router.get("/:listId", auth, getCards);
router.put("/:cardId", auth, updateCard);
router.delete("/:cardId", auth, deleteCard);

export default router;