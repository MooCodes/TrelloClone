import { Schema, model, Document } from "mongoose";

interface ICard extends Document {
  title: string;
  description: string;
  list: Schema.Types.ObjectId;
}

const cardSchema = new Schema<ICard>({
  title: { type: String, required: true },
  description: { type: String },
  list: { type: Schema.Types.ObjectId, ref: "List", required: true },
});

const Card = model<ICard>("Card", cardSchema);

export default Card;
