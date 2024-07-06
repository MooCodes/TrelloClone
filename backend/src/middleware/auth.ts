import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: IUser;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as {
      email: string;
    };

    const user = await User.findOne({ email: decoded.email });

    console.log(user);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .send({ error: "Unauthorized" });
  }
};

export default auth;
