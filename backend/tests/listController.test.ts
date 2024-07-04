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

  describe("getLists", () => {
    it("should get all lists", async () => {
      // create a board
      const boardResponse = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test",
          description: "test",
        })
        .expect(201);

      // create a list
      const listResponse = await api
        .post(`/api/lists/${boardResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test",
        })
        .expect(201);

      const list = await List.findById(listResponse.body._id);
      expect(list).not.toBeNull();

      // get all lists for the board
      const res2 = await api
        .get(`/api/lists/${boardResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res2.body.length).toBe(1);
    });
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

      // create a list in the board
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
      expect(list?.board).toEqual(board?._id);
    });

    it("should create multiple lists for the same board", async () => {
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
      const res = await api
        .post(`/api/lists/${boardResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test",
        })
        .expect(201);
      expect(res.body.title).toBe("test");

      // create another list in the board
      const res2 = await api
        .post(`/api/lists/${boardResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test2",
        })
        .expect(201);
      expect(res2.body.title).toBe("test2");

      const list = await List.findById(res.body._id);
      const list2 = await List.findById(res2.body._id);
      const board = await Board.findById(boardResponse.body._id);

      expect(board?.lists).toHaveLength(2);
      expect(board?.lists).toContainEqual(list?._id);
      expect(board?.lists).toContainEqual(list2?._id);
    });

    it("should not create a list on a board from another user", async () => {
      // create a board
      const boardResponse = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test",
          description: "test",
        })
        .expect(201);

      const { user: user2, token: token2 } = await createUser(
        "test2",
        "test2",
        "test2"
      );

      // user not in the board, should not be able to create a list
      const res = await api
        .post(`/api/lists/${boardResponse.body._id}`)
        .set("Authorization", `Bearer ${token2}`)
        .send({
          title: "test",
        })
        .expect(401);

      // add user to the board
      await api
        .post(`/api/boards/${boardResponse.body._id}/addUser`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          emailToAdd: user2.email,
        });

      // now try to create a list
      const res2 = await api
        .post(`/api/lists/${boardResponse.body._id}`)
        .set("Authorization", `Bearer ${token2}`)
        .send({
          title: "test",
        })
        .expect(201);
    });
  });

  describe("updateList", () => {
    it("should update a list", async () => {
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
      const res = await api
        .post(`/api/lists/${boardResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test",
        })
        .expect(201);

      const list = await List.findById(res.body._id);
      expect(list).not.toBeNull();

      // update the list
      await api
        .put(`/api/lists/${list?._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test2",
        })
        .expect(200);

      const list2 = await List.findById(list?._id);
      expect(list2?.title).toBe("test2");
    });
  });

  describe("deleteList", () => {
    it("should delete a list", async () => {
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
      const res = await api
        .post(`/api/lists/${boardResponse.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test",
        })
        .expect(201);

      const list = await List.findById(res.body._id);
      expect(list).not.toBeNull();

      // delete the list
      await api
        .delete(`/api/lists/${list?._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const list2 = await List.findById(list?._id);
      expect(list2).toBeNull();
      const board2 = await Board.findById(boardResponse.body._id);
      expect(board2?.lists).not.toContainEqual(list?._id);
    });
  });
});
