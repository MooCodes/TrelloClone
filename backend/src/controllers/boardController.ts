import { Response } from "express";
import Board from "../models/Board";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User";
import List from "../models/List";
import Card from "../models/Card";
import { ObjectId } from "mongoose";

export const createBoard = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newBoard = new Board({
      name,
      owner: req.user?._id,
      members: [req.user?._id],
      index: user.boards.length,
    });

    await newBoard.save();

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

    // sort the boards by index
    res.status(200).json(boards);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getBoard = async (req: AuthRequest, res: Response) => {
  const boardId = req.params.boardId;
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.status(200).json(board);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const addUserToBoard = async (req: AuthRequest, res: Response) => {
  const boardId = req.params.boardId;
  const userEmailToAdd = req.body.email;

  console.log(boardId, userEmailToAdd);

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
  const { name, index } = req.body;

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
      { name, index },
      { new: true }
    );

    res.status(200).json(updatedBoard);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const deleteBoard = async (req: AuthRequest, res: Response) => {
  const boardId = req.params.boardId;

  try {
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (board.owner.toString() !== (req.user?._id as string).toString()) {
      return res.status(401).json({
        message: "Unauthorized: Only the board owner can delete the board",
      });
    }

    // update user boards to remove the board
    await User.updateMany(
      { boards: board._id },
      { $pull: { boards: board._id } }
    );

    // delete all lists associated with the board
    await List.deleteMany({ board: boardId });

    // delete all cards associated with the board
    await Card.deleteMany({ list: { $in: board.lists } });

    // finally delete the board
    await Board.findByIdAndDelete(boardId);

    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};
