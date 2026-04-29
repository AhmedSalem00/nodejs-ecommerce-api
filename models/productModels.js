import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " product name is required"],
    },

    description: {
      type: String,
      required: [true, " product description is required"],
    },

    price: {
      type: Number,
      required: [true, " product price is required"],
    },

    stock: {
      type: Number,
      required: [true, " product price is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    image: [
      {
        public_id: {
          type: String,
          url: String,
        },
      },
    ],
  },
  { timestamps: true },
);

export const productModel = mongoose.model("products", productSchema);
export default productModel;
