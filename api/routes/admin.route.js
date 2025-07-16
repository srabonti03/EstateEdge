import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { updateAdminProfile } from "../controllers/admin.controllers.js";
import { uploadAdminAvatar } from "../middleware/multer.js";

const router = express.Router();

// Protected: Update admin profile
router.put("/updateadminprofile", verifyToken, uploadAdminAvatar, updateAdminProfile);

export default router;
