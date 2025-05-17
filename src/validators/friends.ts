import { z } from "zod";

export const AddFriendSchema = z.object({
  username: z.string().min(3),
});
