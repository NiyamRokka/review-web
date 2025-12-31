import { Schema, model, InferSchemaType, Types } from "mongoose";

const commentSchema = new Schema(
  {
    review: {
      type: Types.ObjectId,
      ref: "Review",
      required: true,
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export type CommentType = InferSchemaType<typeof commentSchema>;

export const Comment = model<CommentType>("Comment", commentSchema);
