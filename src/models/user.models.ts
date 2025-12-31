import { Schema, model } from "mongoose";
import { Gender, Role } from "../types/enum.types";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: [true, "user already exists with provided email "],
    },

    profile_picture:{
      path:{
        type:String,
      },
      public_id:{
        type:String,
      },
    },

    password: {
      type: String,
      required: [true, "password is required"],
      min: 6,
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },

    phone: {
      type: String,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      default: Gender.NOT_PREFER,
    },
  },
  { timestamps: true }
);

const User = model("user", userSchema);

export default User;