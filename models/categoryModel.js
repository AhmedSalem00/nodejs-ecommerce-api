import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, " category is required"],
    },
  },
  { timestamps: true },
);

export const categorySchema = mongoose.model("category", categorySchema);
export default categorySchema;
