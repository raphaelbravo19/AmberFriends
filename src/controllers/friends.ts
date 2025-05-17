import { Response } from "express";
import { AppDataSource } from "~config/data-source";
import { Friendship } from "~models/Friendship";
import { User } from "~models/User";
import { AuthenticatedRequest } from "~types/auth";
import { AddFriendSchema } from "~validators/friends";

const userRepo = AppDataSource.getRepository(User);
const friendshipRepo = AppDataSource.getRepository(Friendship);

export const addFriend = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    /* Validate params */
    const { username } = AddFriendSchema.parse(req.body);
    const userId = req.userId;

    /* Unauthorized */
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    /* Check user is not the same */
    const requester = await userRepo.findOne({ where: { id: userId } });
    if (!requester || requester.username === username) {
      return res.status(400).json({ message: "Invalid friend selection" });
    }

    /* Find user to add as a friend */
    const friend = await userRepo.findOne({ where: { username } });
    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    /* Check already friends */
    const existing = await friendshipRepo.findOne({
      where: { user: { id: userId }, friend: { id: friend.id } },
    });

    if (existing) {
      return res.status(409).json({ message: "Already friends" });
    }

    /* Creating bidirectional relation */
    const friendship = friendshipRepo.create({
      user: { id: userId },
      friend: { id: friend.id },
    });

    const bidirectional = friendshipRepo.create({
      user: { id: friend.id },
      friend: { id: userId },
    });

    await friendshipRepo.save([friendship, bidirectional]);

    return res
      .status(201)
      .json({ message: `You are now friends with ${friend.username}` });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: err.errors });
    }
    console.error("Add friend error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getFriends = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;

    /* Unauthorized */
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    /* Fetch friends */
    const friendships = await friendshipRepo.find({
      where: { user: { id: userId } },
      relations: ["friend"],
    });

    const friends = friendships.map((f) => ({
      id: f.friend.id,
      username: f.friend.username,
      email: f.friend.email,
    }));

    return res.status(200).json({ friends });
  } catch (err) {
    console.error("Get friends error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
