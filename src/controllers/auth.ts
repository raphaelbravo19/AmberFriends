// src/controllers/authController.ts
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "~config/data-source";
import { User } from "~models/User";
import { LoginSchema, RegisterSchema } from "~validators/auth";

const userRepo = AppDataSource.getRepository(User);

export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    /* Validate params */
    const { username, email, password } = RegisterSchema.parse(req.body);

    const existing = await userRepo.findOne({
      where: [{ username }, { email }],
    });

    /* Check existing */
    if (existing) {
      return res
        .status(409)
        .json({ message: "Username or email already in use" });
    }

    /* Hashing password and create user */
    const passwordHash = await bcrypt.hash(password, 10);
    const user = userRepo.create({ username, email, passwordHash });
    await userRepo.save(user);

    return res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: err.errors });
    }
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    /* Validate params */
    const { email, password } = LoginSchema.parse(req.body);

    const user = await userRepo.findOne({ where: { email } });

    /* Check existing */
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* Check password */
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* Generate token */
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ token });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: err.errors });
    }
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
