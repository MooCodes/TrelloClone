import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import List from "../src/models/List";
import Board from "../src/models/Board";
import Card from "../src/models/Card";
import User, { IUser } from "../src/models/User";
import { createUser } from "./boardController.test";

const api = request(app);

describe("List Controller", () => {
  let user: IUser;
  let token: string;

  beforeEach(async () => {
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

  describe("createList", () => {
    it("should create a new list", async () => {
      // create a board
      const boardResponse = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test",
          description: "test",
        })
        .expect(201);

      const res = await api
        .post(`/api/lists/${boardResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test",
        })
        .expect(201);

      expect(res.body.title).toBe("test");

      const list = await List.findById(res.body._id);
      expect(list).not.toBeNull();

      const board = await Board.findById(boardResponse.body._id);
      expect(board?.lists).toContainEqual(list?._id);
    });
  });
});
