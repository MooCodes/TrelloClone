import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    console.log(username, email, password);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username: "test", email, password: hashedPassword });

    const savedUser = await user.save();

    const userForToken = {
      email: savedUser.email,
      id: savedUser._id,
    };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET!);

    res.status(201).json({ user: savedUser, token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // const user = await User.findOne({ email }).populate("boards");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userForToken = {
      email: user.email,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET!);

    res.status(200).json({ user, token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};
