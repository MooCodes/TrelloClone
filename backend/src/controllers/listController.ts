import { Request, Response } from "express";
import List from "../models/List";
import Card from "../models/Card";
import Board from "../models/Board";
import { AuthRequest } from "../middleware/auth";
import { ObjectId } from "mongoose";

export const createList = async (req: AuthRequest, res: Response) => {
  const boardId = req.params.boardId;
  const { title } = req.body;

  try {
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // only the board members can create a list
    const isBoardMember = board.members.includes(req.user?._id as ObjectId);
    if (!isBoardMember) {
      return res.status(401).json({
        message: "Unauthorized: Only the board members can create a list",
      });
    }

    // create new list
    const newList = new List({
      title,
      board: board._id,
      index: board.lists.length,
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

export const getLists = async (req: AuthRequest, res: Response) => {
  const boardId = req.params.boardId;

  try {
    // find the corresponding board
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // only the board members can get lists
    const isBoardMember = board.members.includes(req.user?._id as ObjectId);
    if (!isBoardMember) {
      return res.status(401).json({
        message: "Unauthorized: Only the board members can get lists",
      });
    }

    // get lists and populate cards
    const lists = await List.find({ board: boardId }).populate("cards");

    // sort lists by index
    let listsToReturn = lists.sort((a, b) => a.index - b.index);

    // sort cards in each list by index
    listsToReturn = listsToReturn.map((list) => {
      list.cards = list.cards.sort((a: any, b: any) => {
        return a.index - b.index;
      });
      return list;
    });

    if (!lists) {
      return res.status(404).json({ message: "Lists not found" });
    }

    res.status(200).json(listsToReturn);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const moveList = async (req: AuthRequest, res: Response) => {
  const sourceListId = req.params.sourceListId;
  const destinationIndex = Number(req.body.index);

  try {
    const sourceList = await List.findById(sourceListId);

    if (!sourceList) {
      return res.status(404).json({ message: "List not found" });
    }

    // find the board
    const board = await Board.findById(sourceList.board);

    // only board members can move a list
    const isBoardMember = board!.members.includes(req.user?._id as ObjectId);
    if (!isBoardMember) {
      return res.status(401).json({
        message: "Unauthorized: Only the board members can move a list",
      });
    }

    const sourceIndex = sourceList.index;

    // check if moving right or left so we can update all other lists indices
    if (sourceIndex < destinationIndex) {
      // decrement all lists incidies that are lte to the destination index
      // and gte the source index
      await List.updateMany(
        {
          board: sourceList.board,
          index: { $gte: sourceIndex, $lte: destinationIndex },
        },
        { $inc: { index: -1 } }
      );
    } else {
      // increment all lists incidies that are lte to the source index
      // and gte than the destination index
      await List.updateMany(
        {
          board: sourceList.board,
          index: { $lte: sourceIndex, $gte: destinationIndex },
        },
        { $inc: { index: 1 } }
      );
    }

    sourceList.index = destinationIndex;
    await sourceList.save();
    res.status(200).json({ message: "List moved successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const updateList = async (req: AuthRequest, res: Response) => {
  const listId = req.params.listId;
  const { title } = req.body;

  try {
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // find the board
    const board = await Board.findById(list.board);

    // only board members can update a list
    const isBoardMember = board!.members.includes(req.user?._id as ObjectId);
    if (!isBoardMember) {
      return res.status(401).json({
        message: "Unauthorized: Only the board members can update a list",
      });
    }

    // update list
    await List.findByIdAndUpdate(listId, { title });

    res.status(200).json({ message: "List updated successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const deleteList = async (req: AuthRequest, res: Response) => {
  const listId = req.params.listId;

  try {
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // find the board
    const board = await Board.findById(list.board);

    // only board members can delete a list
    const isBoardMember = board!.members.includes(req.user?._id as ObjectId);
    if (!isBoardMember) {
      return res.status(401).json({
        message: "Unauthorized: Only the board members can delete a list",
      });
    }

    const listIndex = list.index;
    // update all lists index that are greater than the deleted list index
    await List.updateMany(
      { board: list.board, index: { $gt: listIndex } },
      { $inc: { index: -1 } }
    );

    // delete all cards associated with the list
    await Card.deleteMany({ list: listId });

    // remove the list from the board
    await Board.findByIdAndUpdate(board!._id, {
      $pull: { lists: listId },
    });

    // finally delete the list
    await List.findByIdAndDelete(listId);

    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};
