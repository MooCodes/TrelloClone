import { Request, Response } from "express";
import Board from "../models/Board";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User";
import { ObjectId } from "mongoose";

export const createBoard = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const newBoard = new Board({
      name,
      description,
      owner: req.user?._id,
      members: [req.user?._id],
    });

    await newBoard.save();

    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // assign board to user
    user.boards.push(newBoard._id as ObjectId);
    await user.save();

    res.status(201).json(newBoard);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const getBoards = async (req: AuthRequest, res: Response) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user?._id }, { members: req.user?._id }],
    });
    res.status(200).json(boards);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const addUserToBoard = async (req: AuthRequest, res: Response) => {
  const boardId = req.params.boardId;
  const userEmailToAdd = req.body.emailToAdd;

  try {
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (board.owner.toString() !== (req.user?._id as string).toString()) {
      return res.status(401).json({
        message: "Unauthorized: Only the board owner can add members",
      });
    }

    const userToAdd = await User.findOne({ email: userEmailToAdd });

    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    }

    if (board.members.includes(userToAdd._id as ObjectId)) {
      return res.status(400).json({ message: "User already in the board" });
    }

    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      { $addToSet: { members: userToAdd._id } },
      { new: true }
    );

    // update user boards
    await User.findByIdAndUpdate(
      userToAdd._id,
      { $addToSet: { boards: board._id } },
      { new: true }
    );

    res.status(200).json(updatedBoard);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const updateBoard = async (req: AuthRequest, res: Response) => {
  const boardId = req.params.boardId;
  const { name, description } = req.body;

  try {
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (board.owner.toString() !== (req.user?._id as string).toString()) {
      return res.status(401).json({
        message: "Unauthorized: Only the board owner can update the board",
      });
    }

    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      { name, description },
      { new: true }
    );

    res.status(200).json(updatedBoard);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};
