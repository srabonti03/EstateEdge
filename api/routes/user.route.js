import express from "express";
import {
  getTotalCustomerCount,
  updateUserProfile,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middleware/jwt.js";
import { uploadAvatar } from "../middleware/multer.js";
import { uploadAgentAvatar } from "../middleware/multer.js";

const router = express.Router();

// Protected: Get the total number of customers registered in the system
router.get("/count", verifyToken, getTotalCustomerCount);

// Protected: Update user profile
router.put("/updateuserprofile", verifyToken, uploadAvatar, updateUserProfile);

export default router;
