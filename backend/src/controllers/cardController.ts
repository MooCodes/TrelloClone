import { Request, Response } from "express";
import Card from "../models/Card";
import List from "../models/List";
import Board from "../models/Board";
import { AuthRequest } from "../middleware/auth";
import { ObjectId } from "mongoose";
import User from "../models/User";

export const createCard = async (req: AuthRequest, res: Response) => {
  const listId = req.params.listId;
  const { title, description } = req.body;

  try {
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // find the board
    const board = await Board.findById(list.board);

    // only board members can create a card
    const isBoardMember = board!.members.includes(req.user?._id as ObjectId);
    if (!isBoardMember) {
      console.log("not a member");
      return res.status(401).json({
        message: "Unauthorized: Only the board members can create a card",
      });
    }

    const newCard = new Card({
      title,
      description,
      list: list._id,
    });

    await newCard.save();

    // add the card to the list
    await List.findByIdAndUpdate(listId, {
      $push: { cards: newCard._id },
    });

    res.status(201).json(newCard);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const getCards = async (req: AuthRequest, res: Response) => {
  const listId = req.params.listId;
  try {
    // find the corresponding list
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // find the corresponding board
    const board = await Board.findById(list.board);

    // only board members can get cards
    const isBoardMember = board!.members.includes(req.user?._id as ObjectId);
    if (!isBoardMember) {
      return res.status(401).json({
        message: "Unauthorized: Only the board members can get cards",
      });
    }

    // get cards from the list
    const cards = await Card.find({ list: list._id });

    if (!cards) {
      return res.status(404).json({ message: "Cards not found" });
    }

    res.status(200).json(cards);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const updateCard = async (req: AuthRequest, res: Response) => {
  const cardId = req.params.cardId;
  const { title, description } = req.body;
  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // find the list
    const list = await List.findById(card.list);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // find the board
    const board = await Board.findById(list.board);

    // only board members can update a card
    const isBoardMember = board!.members.includes(req.user?._id as ObjectId);
    if (!isBoardMember) {
      return res.status(401).json({
        message: "Unauthorized: Only the board members can update a card",
      });
    }

    // update the card
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        title,
        description,
      },
      { new: true }
    );

    res.status(200).json(updatedCard);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const deleteCard = async (req: AuthRequest, res: Response) => {
  const cardId = req.params.cardId;
  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // find the list
    const list = await List.findById(card.list);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // find the board
    const board = await Board.findById(list.board);

    // only board members can delete a card
    const isBoardMember = board!.members.includes(req.user?._id as ObjectId);
    if (!isBoardMember) {
      return res.status(401).json({
        message: "Unauthorized: Only the board members can delete a card",
      });
    }

    // remove the card from the list
    await List.findByIdAndUpdate(list._id, {
      $pull: { cards: cardId },
    });
    
    // finally delete the card
    await Card.findByIdAndDelete(cardId);

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};