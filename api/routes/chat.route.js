import express from "express";
import {
  addChat,
  getChat,
  getChats,
  readChat,
  unreadChat,
  countUnreadChats,
} from "../controllers/chat.controllers.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// Protected: Get all chats for the logged-in user
router.get("/", verifyToken, getChats);

// Protected: Get unread chats for the logged-in user
router.get("/unread", verifyToken, unreadChat);

// Count unread chats
router.get("/unread/count", verifyToken, countUnreadChats);

// Protected: Get a specific chat by ID (includes messages)
router.get("/:id", verifyToken, getChat);

// Protected: Start a new chat or return existing one
router.post("/", verifyToken, addChat);

// Protected: Mark all messages in a chat as read by the user
router.put("/read/:id", verifyToken, readChat);

export default router;
