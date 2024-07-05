import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import Card from "../src/models/Card";
import List from "../src/models/List";
import Board from "../src/models/Board";
import User, { IUser } from "../src/models/User";
import { createUser } from "./boardController.test";
import connectDB from "../src/config/db";

const api = request(app);

describe("Card Controller", () => {
  let user: IUser;
  let token: string;

  beforeEach(async () => {
    await connectDB();
    await User.deleteMany({});
    await Board.deleteMany({});
    await List.deleteMany({});
    await Card.deleteMany({});

    const userData = await createUser("test", "test", "test");

    user = userData.user;
    token = userData.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("createCard", () => {
    it("should create a new card", async () => {
      // create a board
      const boardResponse = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test",
          description: "test",
        })
        .expect(201);

      // create a list in the board
      const listResponse = await api
        .post(`/api/lists/${boardResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test",
        })
        .expect(201);

      // create a card in the list
      const res = await api
        .post(`/api/cards/${listResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "testCard",
          description: "testCard",
        })
        .expect(201);

      expect(res.body.title).toBe("testCard");

      const card = await Card.findById(res.body._id);
      expect(card).not.toBeNull();
    });
  });

  describe("getCards", () => {
    it("should get all cards in a list", async () => {
      // create a board
      const boardResponse = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test",
          description: "test",
        })
        .expect(201);

      // create a list in the board
      const listResponse = await api
        .post(`/api/lists/${boardResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test",
        })
        .expect(201);

      // create a card in the list
      await api
        .post(`/api/cards/${listResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "testCard",
          description: "testCard",
        })
        .expect(201);

      const list = await List.findById(listResponse.body._id);
      expect(list).not.toBeNull();
      const cards = await Card.find({ list: list?._id });
      expect(cards).toHaveLength(1);

      const res = await api
        .get(`/api/cards/${listResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe("updateCard", () => {
    it("should update a card", async () => {
      // create a board
      const boardResponse = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test",
          description: "test",
        })
        .expect(201);

      // create a list in the board
      const listResponse = await api
        .post(`/api/lists/${boardResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test",
        })
        .expect(201);

      // create a card in the list
      const res = await api
        .post(`/api/cards/${listResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "testCard",
          description: "testCard",
        })
        .expect(201);

      const card = await Card.findById(res.body._id);
      expect(card).not.toBeNull();
      expect(card?.title).toBe("testCard");
      expect(card?.description).toBe("testCard");

      const updatedCard = await api
        .put(`/api/cards/${res.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "updatedCard",
          description: "updatedCard",
        })
        .expect(200);
      expect(updatedCard.body.title).toBe("updatedCard");
      expect(updatedCard.body.description).toBe("updatedCard");
    });
  });

  describe("deleteCard", () => {
    it("should delete a card", async () => {
      // create a board
      const boardResponse = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test",
          description: "test",
        })
        .expect(201);

      // create a list in the board
      const listResponse = await api
        .post(`/api/lists/${boardResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test",
        })
        .expect(201);

      // create a card in the list
      const res = await api
        .post(`/api/cards/${listResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "testCard",
          description: "testCard",
        })
        .expect(201);

      const card = await Card.findById(res.body._id);
      expect(card).not.toBeNull();
      expect(card?.title).toBe("testCard");
      expect(card?.description).toBe("testCard");

      let list = await List.findById(listResponse.body._id).populate("cards");
      expect(list).not.toBeNull();
      expect(list?.cards).toHaveLength(1);

      await api
        .delete(`/api/cards/${res.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      
      const deletedCard = await Card.findById(res.body._id);
      expect(deletedCard).toBeNull();

      list = await List.findById(listResponse.body._id).populate("cards");
      expect(list).not.toBeNull();
      expect(list?.cards).toHaveLength(0);
    });
  });
});
