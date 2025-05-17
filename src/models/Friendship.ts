import {
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.friendships, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  friend: User;

  @CreateDateColumn()
  createdAt: Date;
}
