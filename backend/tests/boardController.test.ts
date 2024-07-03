import mongoose, { ObjectId } from "mongoose";
import app from "../src/app";
import request from "supertest";
import User from "../src/models/User";
import Board from "../src/models/Board";
import jwt from "jsonwebtoken";
import exp from "constants";
import List from "../src/models/List";
import Card from "../src/models/Card";

const api = request(app);

const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  const user = new User({
    username,
    email,
    password,
  });
  await user.save();

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);

  return { user, token };
};

describe("Board API", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Board.deleteMany({});
    await List.deleteMany({});
    await Card.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("createBoard", () => {
    it("should create a new board", async () => {
      const { user, token } = await createUser("test", "test", "test");

      // create a new board
      const response = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test",
          description: "test",
        })
        .expect(201);

      const board = await Board.findById(response.body._id);
      expect(board).toBeDefined();
      expect(board?.name).toBe("test");
      expect(board?.description).toBe("test");
      expect(board?.owner.toString()).toBe(user._id?.toString());
      expect(board?.members).toEqual([user._id]);
    });

    it("should return 401 if user is not authenticated", async () => {
      const response = await api
        .post("/api/boards")
        .send({
          name: "test",
          description: "test",
        })
        .expect(401);

      expect(response.body).toEqual({
        error: "Unauthorized",
      });
    });

    it("should add user to board and assign board to user", async () => {
      const { user, token } = await createUser("test", "test", "test");

      // create a new board
      const response = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test",
          description: "test",
        });

      const createdBoard = await Board.findById(response.body._id);

      expect(createdBoard?.members).toContainEqual(user._id);
      expect(createdBoard?.owner.toString()).toBe(user._id?.toString());

      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.boards).toContainEqual(createdBoard?._id);
    });
  });

  describe("getBoards", () => {
    it("should return all boards for a user", async () => {
      const { user, token } = await createUser("test", "test", "test");
      // create a new board
      await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test",
          description: "test",
        });

      await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test2",
          description: "test2",
        });

      const response = await api
        .get("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBe("test");
      expect(response.body[1].name).toBe("test2");
    });

    it("should return all boards for a user that they are a member of", async () => {
      const { user: user1, token: token1 } = await createUser(
        "test",
        "test",
        "test"
      );
      const { user: user2, token: token2 } = await createUser(
        "test2",
        "test2",
        "test2"
      );

      const response = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token1}`)
        .send({
          name: "test board",
          description: "test board",
        });

      await api
        .post(`/api/boards/${response.body._id}/addUser`)
        .set("Authorization", `Bearer ${token1}`)
        .send({
          emailToAdd: user2.email,
        });

      const response2 = await api
        .get("/api/boards")
        .set("Authorization", `Bearer ${token2}`)
        .expect(200);

      expect(response2.body.length).toBe(1);
      expect(response2.body[0].name).toBe("test board");
    });
  });

  describe("addUserToBoard", () => {
    it("should add another user to board", async () => {
      const { user: user1, token: token1 } = await createUser(
        "test",
        "test",
        "test"
      );
      const { user: user2, token: token2 } = await createUser(
        "test2",
        "test2",
        "test2"
      );

      const response = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token1}`)
        .send({
          name: "test",
          description: "test",
        })
        .expect(201);

      // add user to board
      await api
        .post(`/api/boards/${response.body._id}/addUser`)
        .set("Authorization", `Bearer ${token1}`)
        .send({
          emailToAdd: user2.email,
        });

      const updatedBoard = await Board.findById(response.body._id);
      expect(updatedBoard?.members).toContainEqual(user2._id);

      const updatedUser = await User.findById(user2._id);
      expect(updatedUser?.boards).toContainEqual(updatedBoard?._id);
    });

    it("should not add a new user to board if user is not owner of board", async () => {
      const { user: user1, token: token1 } = await createUser(
        "test",
        "test",
        "test"
      );
      const { user: user2, token: token2 } = await createUser(
        "test2",
        "test2",
        "test2"
      );

      const response = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token1}`)
        .send({
          name: "test",
          description: "test",
        })
        .expect(201);

      // try to add user to board without being the owner
      const response2 = await api
        .post(`/api/boards/${response.body._id}/addUser`)
        .set("Authorization", `Bearer ${token2}`)
        .send({
          emailToAdd: user2.email,
        })
        .expect(401);

      expect(response2.body).toEqual({
        message: "Unauthorized: Only the board owner can add members",
      });
    });

    it("should not add a user to the board if the user already exists in the board", async () => {
      const { user: user1, token: token1 } = await createUser(
        "test",
        "test",
        "test"
      );

      const { user: user2, token: token2 } = await createUser(
        "test2",
        "test2",
        "test2"
      );

      const response = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token1}`)
        .send({
          name: "test",
          description: "test",
        })
        .expect(201);

      // add user to board
      await api
        .post(`/api/boards/${response.body._id}/addUser`)
        .set("Authorization", `Bearer ${token1}`)
        .send({
          emailToAdd: user2.email,
        });

      const response2 = await api
        .post(`/api/boards/${response.body._id}/addUser`)
        .set("Authorization", `Bearer ${token1}`)
        .send({
          emailToAdd: user2.email,
        })
        .expect(400);

      expect(response2.body).toEqual({
        message: "User already in the board",
      });
    });
  });

  describe("updateBoard", () => {
    it("should update a board", async () => {
      const { user, token } = await createUser("test", "test", "test");
      const response = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test",
          description: "test",
        })
        .expect(201);

      await api
        .put(`/api/boards/${response.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test2",
          description: "test2",
        })
        .expect(200);

      const updatedBoard = await Board.findById(response.body._id);
      expect(updatedBoard?.name).toBe("test2");
      expect(updatedBoard?.description).toBe("test2");

      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.boards).toContainEqual(updatedBoard?._id);
    });
  });

  describe("deleteBoard", () => {
    it("should delete a board", async () => {
      const { user, token } = await createUser("test", "test", "test");
      const response = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test",
          description: "test",
        })
        .expect(201);

      await api
        .delete(`/api/boards/${response.body._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const deletedBoard = await Board.findById(response.body._id);
      expect(deletedBoard).toBe(null);

      const updatedUser = await User.findById(user._id);

      // check if the board was deleted from the user's boards
      expect(updatedUser?.boards.length).toBe(0);
    });

    it("should not delete a board if the user is not the owner", async () => {
      const { user: user1, token: token1 } = await createUser(
        "test",
        "test",
        "test"
      );
      const { user: user2, token: token2 } = await createUser(
        "test2",
        "test2",
        "test2"
      );

      const response = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token1}`)
        .send({
          name: "test",
          description: "test",
        })
        .expect(201);

      await api
        .delete(`/api/boards/${response.body._id}`)
        .set("Authorization", `Bearer ${token2}`)
        .expect(401);

      const deletedBoard = await Board.findById(response.body._id);
      expect(deletedBoard).not.toBeNull();
    });

    it("should delete a board and its associated lists and cards", async () => {
      const { user, token } = await createUser("test", "test", "test");
      const response = await api
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test",
          description: "test",
        })
        .expect(201);

      const boardId = response.body._id;

      // Create some lists and cards for the board
      const list1 = await List.create({ title: "List 1", board: boardId });
      const list2 = await List.create({ title: "List 2", board: boardId });
      const card1 = await Card.create({
        title: "Card 1",
        description: "test",
        list: list1._id,
      });
      const card2 = await Card.create({
        title: "Card 2",
        description: "test",
        list: list2._id,
      });

      // add the cards to the lists
      list1.cards = [card1._id as ObjectId];
      list2.cards = [card2._id as ObjectId];

      await list1.save();
      await list2.save();

      // update the board with the lists and cards with mongoose
      await Board.findByIdAndUpdate(boardId, {
        lists: [list1._id, list2._id],
      });

      await api
        .delete(`/api/boards/${boardId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const deletedBoard = await Board.findById(boardId);
      expect(deletedBoard).toBe(null);

      const deletedList1 = await List.findById(list1._id);
      expect(deletedList1).toBe(null);

      const deletedList2 = await List.findById(list2._id);
      expect(deletedList2).toBe(null);

      const deletedCard1 = await Card.findById(card1._id);
      expect(deletedCard1).toBe(null);

      const deletedCard2 = await Card.findById(card2._id);
      expect(deletedCard2).toBe(null);

      const updatedUser = await User.findById(user._id);
      // check if the board was deleted from the user's boards
      expect(updatedUser?.boards.length).toBe(0);
    });
  });
});
