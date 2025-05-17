import { Router } from "express";
import { verifyToken } from "~middlewares/auth";
import { addFriend, getFriends } from "~controllers/friends";

const router = Router();

router.post("/add", verifyToken, addFriend);
router.get("/", verifyToken, getFriends);

export default router;
