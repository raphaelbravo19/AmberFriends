import { Router } from "express";
import { getProfile } from "~controllers/user";
import { verifyToken } from "~middlewares/auth";

const router = Router();

router.get("/profile", verifyToken, getProfile);

export default router;
