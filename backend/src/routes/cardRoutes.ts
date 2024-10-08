import { Router } from "express";
import {
  createCard,
  deleteCard,
  getCards,
  updateCard,
  moveCard,
  moveCardToList,
} from "../controllers/cardController";
import auth from "../middleware/auth";

const router = Router();

router.post("/:listId", auth, createCard);
router.get("/:listId", auth, getCards);
router.put("/:cardId", auth, updateCard);
router.patch("/:cardId", auth, moveCard);
router.put("/:cardId/:listId", auth, moveCardToList);
router.delete("/:cardId", auth, deleteCard);

export default router;
