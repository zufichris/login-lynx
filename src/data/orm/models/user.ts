import mongoose from "mongoose";
import { IUser } from "../../entities/user";

const schema = new mongoose.Schema<IUser>(
  {
    firstName: String,
    email: String,
    userName:String,
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.models.User || mongoose.model("User", schema);
