import mongoose from "mongoose";
import app from "../src/app";
import request from "supertest";
import User from "../src/models/User";

describe("GET /", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  it("should return 200", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("API Running");
  });

  it("should create a new user", async () => {
    const user = {
      username: "test",
      email: "test",
      password: "test",
    };

    const res = await request(app).post("/api/users/register").send(user);

    expect(res.status).toBe(201);
    expect(res.body.user.username).toBe("test");
    expect(res.body.user.email).toBe("test");

    const createdUser = await User.findOne({ email: "test" });

    expect(createdUser).not.toBeNull();
    expect(createdUser?.username).toBe("test");
    expect(createdUser?.email).toBe("test");
  });


  afterAll(async () => {
    console.log("yo");
    await mongoose.connection.close();
  });
});
