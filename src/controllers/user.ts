import { AuthenticatedRequest } from "~types/auth";
import { Response } from "express";
import { AppDataSource } from "~config/data-source";
import { User } from "~models/User";

const userRepo = AppDataSource.getRepository(User);

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;

    /* Unauthorized */
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    /* Fetch profile */
    const user = await userRepo.findOne({ where: { id: userId } });

    /* Check existing */
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
