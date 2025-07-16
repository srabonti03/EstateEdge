import express from "express";
import {
  getAllAgents,
  getAgentById,
  updateAgent,
  deactivateAgent,
  reactivateAgent,
  getTotalAgentsCount,
  updateAgentProfile,
} from "../controllers/agent.controllers.js";
import { verifyToken } from "../middleware/jwt.js";
import { uploadAgentAvatar } from "../middleware/multer.js";

const router = express.Router();

// Public: Get list of all agents
router.get("/all", getAllAgents);

// Protected: Update agent profile
router.put("/updateagentprofile", verifyToken, uploadAgentAvatar, updateAgentProfile);

// Protected: Get the total number of agents registered in the system
router.get("/count", verifyToken, getTotalAgentsCount);

// Public: Get details of a specific agent by ID
router.get("/:id", getAgentById);

// Protected: Update an agent's information (requires login as admin)
router.put("/:id", verifyToken, updateAgent);

// Protected: Deactivate an agent by ID (requires login as admin)
router.put("/deactivate/:id", verifyToken, deactivateAgent);

// Protected: Reactivate an agent by ID (requires login as admin)
router.put("/reactivate/:id", verifyToken, reactivateAgent);

export default router;
