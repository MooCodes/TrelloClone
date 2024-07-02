import { Schema, model, Document } from "mongoose";

export interface IBoard extends Document {
  name: string;
  description?: string;
  owner: Schema.Types.ObjectId;
  members: Schema.Types.ObjectId[];
  lists: Schema.Types.ObjectId[];
}

const boardSchema = new Schema<IBoard>({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  lists: [{ type: Schema.Types.ObjectId, ref: "List" }],
});

boardSchema.methods.toJSON = function () {
  const board = this.toObject();
  delete board.__v;
  return board;
};

const Board = model<IBoard>("Board", boardSchema);

export default Board;
