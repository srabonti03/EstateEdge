import express from "express";
import {
  getAllPosts,
  getPosts,
  getPost,
  addPost,
  getAllLocations,
  updatePost,
  archivePost,
  unarchivePost,
  approvePost,
  getSavedPosts,
  addToSavedPosts,
  removeFromSavedPosts,
  getAllApprovedPosts,
  getPendingPostsCount,
  getLocationDistribution,
  getApprovedPostsCount,
  getApprovedPostsOfAgent,
  getLocationDistributionWithPrices,
  getSoldPosts,
  markPostAsSold
} from "../controllers/post.controllers.js";
import { verifyToken, optionalVerifyToken } from "../middleware/jwt.js";
import uploadImages from "../middleware/multer.js";

const router = express.Router();

// Admin: get every post, no filter
router.get("/all", verifyToken, getAllPosts);

// Public: get all posts with optional filters
router.get("/filter", optionalVerifyToken, getPosts);
router.get("/approved", optionalVerifyToken, getAllApprovedPosts);

// Public or Protected: Get all locations of the posts (property listings created by agents)
router.get("/locations", verifyToken, getAllLocations);

// Protected: Location distribution - for PieChart
router.get("/distribution/location", verifyToken, getLocationDistribution);

// Protected: route to get location distribution with average prices
router.get('/distribution/location-prices', verifyToken, getLocationDistributionWithPrices);

// Protected: Get the total number of posts waiting for approval
router.get("/pending/count", verifyToken, getPendingPostsCount);

// Protected: Get the total number of approved posts
router.get("/approved/count", verifyToken, getApprovedPostsCount);

// Protected: get approved posts by admin (agent-specific)
router.get("/approved/:agentId", verifyToken, getApprovedPostsOfAgent);

// Saved posts management for logged-in users
router.get("/savedposts", verifyToken, getSavedPosts);
router.post("/savedposts/:id", verifyToken, addToSavedPosts);
router.delete("/savedposts/:id", verifyToken, removeFromSavedPosts);

// Add new post
router.post("/addpost", verifyToken, uploadImages, addPost);

// Approve a post by admin
router.put("/approve/:id", verifyToken, approvePost);

// Get all posts that are marked as sold
router.get("/sold", getSoldPosts);

// Mark a specific post as sold
router.put("/:id/sold", verifyToken, markPostAsSold);

// Post-specific actions (get, update, archive, unarchive) by post ID
router.get("/:id", getPost);
router.put("/:id", verifyToken, uploadImages, updatePost);
router.put("/archive/:id", verifyToken, archivePost);
router.put("/unarchive/:id", verifyToken, unarchivePost);

export default router;
