import { Schema, model, Document } from "mongoose";

interface ICard extends Document {
  title: string;
  list: Schema.Types.ObjectId;
  index: number;
}

const cardSchema = new Schema<ICard>({
  title: { type: String, required: true },
  list: { type: Schema.Types.ObjectId, ref: "List", required: true },
  index: { type: Number, required: true },
});

const Card = model<ICard>("Card", cardSchema);

export default Card;
