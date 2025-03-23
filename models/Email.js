import mongoose from "mongoose";

const { Schema } = mongoose;

const emailSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { collection: "email" }
);

const Email = mongoose.model("Email", emailSchema);

export default Email;