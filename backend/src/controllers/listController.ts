import { Request, Response } from "express";
import List from "../models/List";
import Board from "../models/Board";
import { AuthRequest } from "../middleware/auth";

export const createList = async (req: AuthRequest, res: Response) => {
  const boardId = req.params.boardId;
  const { title } = req.body;

  try {
    // find the board
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (board.owner.toString() !== (req.user?._id as string).toString()) {
      return res.status(401).json({
        message: "Unauthorized: Only the board owner can create lists",
      });
    }

    // create new list
    const newList = new List({
      title,
      board: board._id,
    });

    await newList.save();

    // add list to board
    await Board.findByIdAndUpdate(boardId, {
      $push: { lists: newList._id },
    });

    res.status(201).json(newList);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};
