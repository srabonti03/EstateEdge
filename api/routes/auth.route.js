import express from "express";
import {
  login,
  logout,
  register,
  verifyEmail,
  requestPasswordReset,
  verifyResetToken,
} from "../controllers/auth.controllers.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// Register a new user
router.post("/register", register);

// Log in an existing user
router.post("/login", login);

// Email verification (via token from email link)
router.get("/verify-email", verifyEmail);

// Request password reset (sends email with token)
router.post("/password-reset-request", requestPasswordReset);

// Verify reset token before allowing new password
router.get("/password-reset-verify", verifyResetToken);

// Log out the currently logged-in user
router.post("/logout", verifyToken, logout);

export default router;
