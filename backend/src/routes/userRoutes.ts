import { Router } from "express";
import { createUser, loginUser } from "../controllers/userController";
import auth, { AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);

router.get("/me", auth, (req: AuthRequest, res) => {
  res.send(req.user);
});

export default router;