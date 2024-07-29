import { Response } from "express";
import Card from "../models/Card";
import List, { IList } from "../models/List";
import Board from "../models/Board";
import { AuthRequest } from "../middleware/auth";
import { ObjectId } from "mongoose";

export const createCard = async (req: AuthRequest, res: Response) => {
  const listId = req.params.listId;
  const { title } = req.body;

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
      list: list._id,
      index: list.cards.length,
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

    // sort the cards by index
    const cardsToSend = cards.sort((a, b) => a.index - b.index);

    res.status(200).json(cardsToSend);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const moveCardToList = async (req: AuthRequest, res: Response) => {
  const cardId = req.params.cardId;
  const listId = req.params.listId;
  const index = req.params.index;

  try {
    const card = await Card.findById(cardId);
    const list = await List.findById(listId);

    if (!card || !list) {
      return res.status(404).json({ message: "Card or list not found" });
    }

    const previousList = await List.findById(card.list);

    // find the board
    const board = await Board.findById(list.board);

    // only board members can move a card
    const isBoardMember = board!.members.includes(req.user?._id as ObjectId);
    if (!isBoardMember) {
      return res.status(401).json({
        message: "Unauthorized: Only the board members can move a card",
      });
    }

    // remove the card from the old list
    await List.findByIdAndUpdate(previousList!._id, {
      $pull: { cards: cardId },
    });

    // update the indices of all the cards in the old list that are after the card
    await Card.updateMany(
      { list: previousList!._id, index: { $gte: card.index } },
      { $inc: { index: -1 } }
    );

    // update the indices of all the cards in the new list that are after the card
    await Card.updateMany(
      { list: list._id, index: { $gte: index } },
      { $inc: { index: 1 } },
      { new: true }
    );

    // set the card's list to the new list
    // set the card's index to the new index
    await Card.findByIdAndUpdate(cardId, {
      list: list._id,
      index,
    });

    // add the card to the new list
    await List.findByIdAndUpdate(list._id, {
      $push: { cards: cardId },
    });

    res.status(200).json({ message: "Card moved successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const moveCard = async (req: AuthRequest, res: Response) => {
  const sourceCardId = req.params.sourceCardId;
  const destinationIndex = Number(req.params.destinationIndex);

  try {
    const sourceCard = await Card.findById(sourceCardId);

    if (!sourceCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    // find the lists that the cards belong to
    const sourceList = await List.findById(sourceCard.list);

    if (!sourceList) {
      return res.status(404).json({ message: "List not found" });
    }

    // find the board
    const board = await Board.findById(sourceList.board);

    // only board members can move a card
    const isBoardMember = board!.members.includes(req.user?._id as ObjectId);
    if (!isBoardMember) {
      return res.status(401).json({
        message: "Unauthorized: Only the board members can move a card",
      });
    }

    const sourceCardIndex = sourceCard.index;

    // are we moving the card into a different list?
    // check if moving right or left so we can update all other card indices
    if (sourceCardIndex < destinationIndex) {
      // decrement all card incidies that are lte to the destination index
      // and gte the source index
      await Card.updateMany(
        {
          list: sourceList._id,
          index: { $lte: destinationIndex, $gte: sourceCardIndex },
        },
        { $inc: { index: -1 } }
      );
    } else if (sourceCardIndex > destinationIndex) {
      // increment all card incidies that are gte to the source index
      // and lte the destination index
      await Card.updateMany(
        {
          list: sourceList._id,
          index: { $gte: destinationIndex, $lte: sourceCardIndex },
        },
        { $inc: { index: 1 } }
      );
    }

    sourceCard.index = destinationIndex;
    await sourceCard.save();
    res.status(200).json(sourceCard);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const updateCard = async (req: AuthRequest, res: Response) => {
  const cardId = req.params.cardId;
  const { title } = req.body;
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
      { title },
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
