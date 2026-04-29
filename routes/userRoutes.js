import express from "express";
import {
  registerUserController,
  loginUserController,
  getUserProfileController,
  logoutUserController,
  updateUserProfileController,
  updatePasswordController,
  updateProfilePicController,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

//router object
const router = express.Router();

//routes
router.post("/register", registerUserController);

//login route'
router.post("/login", loginUserController);

//profile route
router.get("/profile", isAuthenticated, getUserProfileController);

//logout route
router.get("/logout", isAuthenticated, logoutUserController);

//update profile route
router.put("/profile-update", isAuthenticated, updateUserProfileController);

//update password
router.put("/password-update", isAuthenticated, updatePasswordController);

//update profile pic
router.put(
  "/update-picture",
  isAuthenticated,
  singleUpload,
  updateProfilePicController,
);

//export router
export default router;
