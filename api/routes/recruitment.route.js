import express from "express";
import {
  getRecruitments,
  recruitmentPost,
  updateRecruitmentPost,
  disableRecruitmentPost,
  enableRecruitmentPost,
  getRecruitmentPostById,
  applyForRecruitment,
  getApplicantsForRecruitment,
  getSingleApplicantForRecruitment,
  updateApplicationStatus,
} from "../controllers/recruitment.controllers.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// Protected: get recruitments for new admin or agent
router.get("/", verifyToken, getRecruitments);

// Protected: get single recruitment post by ID (Only Admin)
router.get("/:id",verifyToken,  getRecruitmentPostById);

// Protected: Recruitment Post creation (Only Admin)
router.post("/", verifyToken, recruitmentPost);

// Protected: Update recruitment post by ID (Only Admin)
router.put("/:id", verifyToken, updateRecruitmentPost);

// Protected: Disable a recruitment post (soft delete)
router.patch("/:id/disable", verifyToken, disableRecruitmentPost);

// Protected: Enable a previously disabled recruitment post
router.patch("/:id/enable", verifyToken, enableRecruitmentPost);

// Apply to a specific recruitment post using ID from URL
router.post("/:id/apply", verifyToken, applyForRecruitment);

// Get all applicants for a recruitment post (Only admin)
router.get("/:id/applicants", verifyToken, getApplicantsForRecruitment);

// Get one applicant’s full info + application (Admin only)
router.get("/:recruitmentId/applicant/:userId", verifyToken, getSingleApplicantForRecruitment);

// Update the status of an application (Only Admin)
router.patch("/application/:applicationId/status", verifyToken, updateApplicationStatus);

export default router;
