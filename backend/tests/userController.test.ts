import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import User from "../src/models/User";
import connectDB from "../src/config/db";

const api = request(app);

describe("User Controller", () => {

  beforeEach(async () => {
    await connectDB();
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const res = await api
        .post("/api/users/register")
        .send({
          username: "test",
          email: "test",
          password: "test",
        })
        .expect(201);
      expect(res.body.user.username).toBe("test");
      expect(res.body.user.email).toBe("test");
      expect(res.body.token).toBeTruthy();

      const user = await User.findOne({ username: "test" });
      expect(user).not.toBeNull();
      expect(user?.password).not.toBe("test");
    });
  });
});