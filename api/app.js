import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import agentRoutes from "./routes/agent.route.js";
import adminRoutes from "./routes/admin.route.js";
import postRoutes from "./routes/post.route.js";
import chatRoutes from "./routes/chat.route.js";
import messageRoutes from "./routes/message.route.js";
import recruitmentRoutes from "./routes/recruitment.route.js";
import { recruitmentCron } from './lib/recruitment.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/post", postRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/recruitment", recruitmentRoutes);

app.use('/posts', express.static(path.join(__dirname, "..", "public", "posts")));
app.use('/users', express.static(path.join(__dirname, "..", "public", "users")));
app.use('/agents', express.static(path.join(__dirname, "..", "public", "agents")));
app.use('/admins', express.static(path.join(__dirname, "..", "public", "admins")));


async function testDbConnection() {
  try {
    await prisma.user.findFirst();
    console.log("✅ Connected to MongoDB via Prisma.");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3000;

recruitmentCron();

app.listen(PORT, () => {
  console.log(`✅ HTTP Backend running at http://localhost:${PORT}`);
  testDbConnection();
});
