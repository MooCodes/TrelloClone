import { Schema, model, Document } from "mongoose";

export interface IList extends Document {
  title: string;
  cards: Schema.Types.ObjectId[];
  board: Schema.Types.ObjectId;
  index: number;
}

const listSchema = new Schema<IList>({
  title: { type: String, required: true },
  cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
  board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
  index: { type: Number, required: true },
});

const List = model<IList>("List", listSchema);

export default List;
