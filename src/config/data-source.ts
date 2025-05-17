import "reflect-metadata";
import { DataSource } from "typeorm";
import { Friendship } from "~models/Friendship";
import { User } from "~models/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Friendship],
});
