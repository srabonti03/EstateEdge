import express from "express";
import { addMessage } from "../controllers/message.controllers.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// Protected: Add a new message to an existing chat
router.post("/:id/messages", verifyToken, addMessage);

export default router;
