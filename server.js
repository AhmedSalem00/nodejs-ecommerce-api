import express from "express";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { connect } from "mongoose";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import productRoutes from "./routes/productRoutes.js";

//config env
dotenv.config();
connectDB();

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//rest object
const app = express();
app.use(cors());

//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);

//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} on ${process.env.NODE_ENV} Mode`
      .bgMagenta.white,
  );
});
