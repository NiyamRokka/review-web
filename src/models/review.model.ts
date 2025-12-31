import { Schema, model, InferSchemaType, Types } from "mongoose";


export interface ReviewDocument extends Document {
  user: Types.ObjectId;
  item: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      type: Types.ObjectId,
      ref: "Item",
      required: true,
    },
    likes: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    comment: {
    type: String,
    trim: true,
    },
  },
  { timestamps: true }
);

export type ReviewType = InferSchemaType<typeof reviewSchema>;

export const Review = model<ReviewType>("Review", reviewSchema);
