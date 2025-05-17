import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { AppDataSource } from "~config/data-source";
import { authRoutes, userRoutes, friendsRoutes } from "~routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/friends", friendsRoutes);

app.get("/", (_, res) => {
  res.send("Backend API is up.");
});

/* Database */
AppDataSource.initialize()
  .then(() => {
    console.log("[Database] PostgreSQL connection established.");
    app.listen(PORT, () => {
      console.log(`[Server] Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[Startup Error] Failed to initialize data source:", err);
    process.exit(1);
  });
