import { Schema, model, Document } from "mongoose";

export interface IBoard extends Document {
  name: string;
  lists: Schema.Types.ObjectId[];
  members: Schema.Types.ObjectId[];
}

const boardSchema = new Schema<IBoard>({
  name: { type: String, required: true },
  lists: [{ type: Schema.Types.ObjectId, ref: "List" }],
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Board = model<IBoard>("Board", boardSchema);

export default Board;
