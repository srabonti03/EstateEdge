import { fileURLToPath } from "url";
import prisma from "../lib/prisma.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all posts that are marked as sold
export const getSoldPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        isSold: true,
      },
      include: {
        user: {
          select: {
            username: true,
          }
        }
      }
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get sold posts" });
  }
};

// Mark a post as sold by ID
export const markPostAsSold = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        isSold: true,
      },
    });

    res.status(200).json({ message: "Post marked as sold", post: updatedPost });
  } catch (err) {
    if (err.code === "P2023") {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    console.error(err);
    res.status(500).json({ message: "Failed to mark post as sold" });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        isSold: false,
      },
      include: {
        user: {
          select: {
            username: true,
          }
        }
      }
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

// Get all approved property listings with full location and details
export const getAllLocations = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        isApproved: true,
        isSold: false,
        isArchived: false,
      },
      select: {
        id: true,
        title: true,
        price: true,
        address: true,
        city: true,
        latitude: true,
        longitude: true,
        bedroom: true,
        bathroom: true,
        images: true,
      },
    });

    const formattedPosts = posts.map(post => ({
      ...post,
      latitude: Number(post.latitude),
      longitude: Number(post.longitude),
    }));

    res.status(200).json({ posts: formattedPosts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

// Get location distribution of approved property posts
export const getLocationDistribution = async (req, res) => {
  try {
    const approvedPosts = await prisma.post.findMany({
      where: {
        isApproved: true,
        isSold: false,
        isArchived: false,
      },
      select: {
        city: true,
      },
    });

    const locationCounts = approvedPosts.reduce((acc, post) => {
      const city = post.city?.trim();
      if (city) {
        acc[city] = (acc[city] || 0) + 1;
      }
      return acc;
    }, {});

    const pieData = Object.entries(locationCounts).map(([city, count]) => ({
      name: city,
      value: count,
    }));

    res.status(200).json(pieData);
  } catch (error) {
    console.error("Error fetching location distribution:", error);
    res.status(500).json({ message: "Failed to get location distribution" });
  }
};

// Get location distribution with average prices
export const getLocationDistributionWithPrices = async (req, res) => {
  try {
    const approvedPosts = await prisma.post.findMany({
      where: { isApproved: true, isSold: false, isArchived: false },
      select: { city: true, price: true },
    });

    const cityMap = approvedPosts.reduce((acc, post) => {
      const city = post.city?.trim();
      if (city) {
        if (!acc[city]) acc[city] = { totalPrice: 0, count: 0 };
        acc[city].totalPrice += post.price || 0;
        acc[city].count += 1;
      }
      return acc;
    }, {});

    const data = Object.entries(cityMap).map(([city, { totalPrice, count }]) => ({
      city,
      averagePrice: Math.round(totalPrice / count),
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching location prices:', error);
    res.status(500).json({ message: 'Failed to get location distribution with prices' });
  }
};

// Get all approved posts
export const getAllApprovedPosts = async (req, res) => {
  console.log("API getAllApprovedPosts called");
  console.log("User role from request:", req.userRole);

  let filter = { isApproved: true, isSold: false };

  if (req.userRole === "user" || req.userRole === "guest") {
    filter.isArchived = false;
  }

  try {
    const posts = await prisma.post.findMany({ where: filter });
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to get approved posts" });
  }
};

// Get the total number of pending posts
export const getPendingPostsCount = async (req, res) => {
  try {
    const count = await prisma.post.count({
      where: {
        isApproved: false,
        isSold: false,
        isArchived: false,
      },
    });

    res.status(200).json({ pendingCount: count });
  } catch (err) {
    console.error("Error fetching pending posts count:", err);
    res.status(500).json({ message: "Failed to get pending posts count" });
  }
};

// Get the total number of approved posts
export const getApprovedPostsCount = async (req, res) => {
  try {
    const count = await prisma.post.count({
      where: {
        isApproved: true,
        isSold: false,
        isArchived: false,
      },
    });
    res.status(200).json({ approvedCount: count });
  } catch (err) {
    console.error("Error fetching approved posts count:", err);
    res.status(500).json({ message: "Failed to get approved posts count" });
  }
};

// Get all approved posts of a specific agent
export const getApprovedPostsOfAgent = async (req, res) => {
  const { agentId } = req.params;

  if (!agentId || typeof agentId !== "string") {
    return res.status(400).json({ message: "Invalid agent ID" });
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        isApproved: true,
        isSold: false,
        isArchived: false,
        userId: agentId,
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching approved posts of agent:", error);
    return res.status(500).json({ message: "Failed to get approved posts of agent" });
  }
};

// Get single post by ID (public access)
export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    if (err.code === "P2023") {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    console.error(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

// Get all saved posts of logged-in user
export const getSavedPosts = async (req, res) => {
  const userId = req.userId;

  try {
    const savedPosts = await prisma.savedPost.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            postDetail: true,
            user: {
              select: {
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    const posts = savedPosts.map(item => item.post);

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get saved posts" });
  }
};

// Add a post to saved posts
export const addToSavedPosts = async (req, res) => {
  const userId = req.userId;
  const postId = req.params.id;

  try {
    const existing = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Post already saved" });
    }

    const savedPost = await prisma.savedPost.create({
      data: {
        userId,
        postId,
      },
    });

    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save post" });
  }
};

// Remove a post from saved posts
export const removeFromSavedPosts = async (req, res) => {
  const userId = req.userId;
  const postId = req.params.id;

  try {
    await prisma.savedPost.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    res.status(200).json({ message: "Removed from saved posts" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove saved post" });
  }
};

// Get all approved posts with optional filters
export const getPosts = async (req, res) => {
  const query = req.query;
  const role = req.userRole || "guest";

  try {
    const andConditions = [
      { isApproved: true, isSold: false },
    ];

    if (role === "user" || role === "guest") {
      andConditions.push({ isArchived: false });
    }

    if (query.city) {
      andConditions.push({
        city: {
          equals: query.city,
          mode: 'insensitive',
        },
      });
    }

    if (query.type) {
      andConditions.push({ type: { equals: query.type } });
    }

    if (query.property) {
      andConditions.push({ property: { equals: query.property } });
    }

    if (query.bedroom) {
      andConditions.push({ bedroom: parseInt(query.bedroom) });
    }

    if (query.bathroom) {
      andConditions.push({ bathroom: parseInt(query.bathroom) });
    }

    if (query.minPrice || query.maxPrice) {
      const priceFilter = {};
      if (query.minPrice) priceFilter.gte = parseInt(query.minPrice);
      if (query.maxPrice) priceFilter.lte = parseInt(query.maxPrice);
      andConditions.push({ price: priceFilter });
    }

    const posts = await prisma.post.findMany({
      where: {
        AND: andConditions,
      },
    });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found for the applied filters." });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

// Add new post - Only agents allowed
export const addPost = async (req, res) => {
  const tokenUserId = req.userId;
  const body = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: tokenUserId },
    });

    if (!user || user.role !== "agent") {
      return res.status(403).json({ message: "Only agents can create posts." });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Inactive agent cannot create new posts." });
    }

    if (!body.title || !body.price || !body.address) {
      return res.status(400).json({ message: "Title, price and address are required." });
    }

    const existingPost = await prisma.post.findFirst({
      where: {
        userId: tokenUserId,
        title: body.title,
        address: body.address,
      },
    });

    if (existingPost) {
      return res.status(409).json({ message: "You already posted this property." });
    }

    const images = (req.files || []).map(file => `/posts/${file.filename}`);

    const validUtilities = ["owner", "tenant", "shared"];
    const validPets = ["allowed", "not_allowed"];

    const utilities = validUtilities.includes(body.utilities) ? body.utilities : null;
    const pet = validPets.includes(body.pet) ? body.pet : null;

    const postDetailData = {
      desc: body.desc || "No description provided",
      utilities,
      pet,
      income: body.income || null,
      size: body.size ? parseInt(body.size) : null,
      school: body.school ? parseInt(body.school) : null,
      bus: body.bus ? parseInt(body.bus) : null,
      restaurant: body.restaurant ? parseInt(body.restaurant) : null,
    };

    const newPost = await prisma.post.create({
      data: {
        title: body.title,
        price: parseInt(body.price),
        address: body.address,
        city: body.city || "",
        bedroom: body.bedroom ? parseInt(body.bedroom) : 0,
        bathroom: body.bathroom ? parseInt(body.bathroom) : 0,
        latitude: body.latitude || "",
        longitude: body.longitude || "",
        type: body.type || "",
        property: body.property || "",
        userId: tokenUserId,
        images,
        isApproved: false,
        postDetail: {
          create: postDetailData,
        },
      },
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// Approve post - Only admins allowed
export const approvePost = async (req, res) => {
  const postId = req.params.id;
  const adminId = req.userId;

  console.log("approvePost called with postId:", postId, "adminId:", adminId);

  try {
    const user = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!user || user.role !== "admin") {
      console.log("Unauthorized access by user:", user?.id);
      return res.status(403).json({ message: "Only admins can approve posts." });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      console.log("Post not found");
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.isArchived) {
      console.log("Attempted to approve archived post");
      return res.status(400).json({ message: "Cannot approve an archived post." });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        isApproved: true,
        approvedAt: new Date(),
      },
    });

    return res.status(200).json({ message: "Post approved successfully", post: updatedPost });
  } catch (err) {
    console.error("Error in approvePost:", err);
    return res.status(500).json({ message: "Failed to approve post" });
  }
};

// Update post - Only owner or admin
export const updatePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const body = req.body;

  const validTypes = ["buy", "rent"];
  const validProperties = ["apartment", "house", "room"];
  const validUtilities = ["owner", "tenant", "shared"];
  const validPets = ["allowed", "not_allowed"];

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { postDetail: true },
    });

    if (!post) return res.status(404).json({ message: "Post not found." });

    const user = await prisma.user.findUnique({ where: { id: tokenUserId } });

    if (!user) return res.status(403).json({ message: "User not authorized." });

    const isOwner = post.userId === tokenUserId;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "You do not have permission to update this post." });

    if (
      body.title &&
      body.address &&
      (body.title !== post.title || body.address !== post.address)
    ) {
      const existingPost = await prisma.post.findFirst({
        where: {
          userId: tokenUserId,
          title: body.title,
          address: body.address,
          NOT: { id },
        },
      });
      if (existingPost)
        return res.status(409).json({ message: "You already posted a property with this title and address." });
    }

    if (body.type && !validTypes.includes(body.type))
      return res.status(400).json({ message: `Invalid type. Allowed types: ${validTypes.join(", ")}` });

    if (body.property && !validProperties.includes(body.property))
      return res.status(400).json({ message: `Invalid property. Allowed properties: ${validProperties.join(", ")}` });

    const changedFields = {};

    if (body.title && body.title !== post.title) changedFields.title = body.title;
    if (body.price !== undefined && parseInt(body.price) !== post.price) changedFields.price = parseInt(body.price);
    if (body.address && body.address !== post.address) changedFields.address = body.address;
    if (body.city && body.city !== post.city) changedFields.city = body.city;
    if (body.bedroom !== undefined && parseInt(body.bedroom) !== post.bedroom) changedFields.bedroom = parseInt(body.bedroom);
    if (body.bathroom !== undefined && parseInt(body.bathroom) !== post.bathroom) changedFields.bathroom = parseInt(body.bathroom);
    if (body.latitude && body.latitude !== post.latitude) changedFields.latitude = body.latitude;
    if (body.longitude && body.longitude !== post.longitude) changedFields.longitude = body.longitude;
    if (body.type && body.type !== post.type) changedFields.type = body.type;
    if (body.property && body.property !== post.property) changedFields.property = body.property;

    const newImages =
      req.files && Array.isArray(req.files) && req.files.length > 0
        ? req.files.map((file) => `/posts/${file.filename}`)
        : post.images;

    if (JSON.stringify(newImages) !== JSON.stringify(post.images)) {
      changedFields.images = newImages;
    }

    let postDetailData = {};

    if (body.postDetail) {
      if (body.postDetail.desc && body.postDetail.desc !== post.postDetail?.desc)
        postDetailData.desc = body.postDetail.desc;

      if (
        body.postDetail.utilities &&
        validUtilities.includes(body.postDetail.utilities) &&
        body.postDetail.utilities !== post.postDetail?.utilities
      )
        postDetailData.utilities = body.postDetail.utilities;

      if (
        body.postDetail.pet &&
        validPets.includes(body.postDetail.pet) &&
        body.postDetail.pet !== post.postDetail?.pet
      )
        postDetailData.pet = body.postDetail.pet;

      if (
        body.postDetail.income !== undefined &&
        body.postDetail.income !== post.postDetail?.income
      )
        postDetailData.income = body.postDetail.income;

      if (
        body.postDetail.size !== undefined &&
        parseInt(body.postDetail.size) !== post.postDetail?.size
      )
        postDetailData.size = parseInt(body.postDetail.size);

      if (
        body.postDetail.school !== undefined &&
        parseInt(body.postDetail.school) !== post.postDetail?.school
      )
        postDetailData.school = parseInt(body.postDetail.school);

      if (
        body.postDetail.bus !== undefined &&
        parseInt(body.postDetail.bus) !== post.postDetail?.bus
      )
        postDetailData.bus = parseInt(body.postDetail.bus);

      if (
        body.postDetail.restaurant !== undefined &&
        parseInt(body.postDetail.restaurant) !== post.postDetail?.restaurant
      )
        postDetailData.restaurant = parseInt(body.postDetail.restaurant);
    }

    if (Object.keys(changedFields).length === 0 && Object.keys(postDetailData).length === 0) {
      return res.status(200).json({ message: "No changes detected, post not updated."});
    }

    if (Object.keys(changedFields).length > 0) {
      await prisma.post.update({
        where: { id },
        data: changedFields,
      });
    }

    if (Object.keys(postDetailData).length > 0) {
      if (post.postDetail) {
        await prisma.postDetail.update({
          where: { postId: id },
          data: postDetailData,
        });
      } else {
        await prisma.postDetail.create({
          data: {
            postId: id,
            ...postDetailData,
          },
        });
      }
    }

    const updatedPost = await prisma.post.findUnique({
      where: { id },
      include: { postDetail: true },
    });

    return res.status(200).json(updatedPost);
  } catch (err) {
    console.error(`Failed to update post ${id}:`, err);
    return res.status(500).json({ message: "Failed to update post due to server error." });
  }
};

// Archive post - Only owner or admin
export const archivePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const user = await prisma.user.findUnique({ where: { id: tokenUserId } });
    if (!user) return res.status(403).json({ message: "Not Authorized!" });

    const isOwner = post.userId === tokenUserId;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can't archive this post" });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { isArchived: true },
    });

    return res.status(200).json({ message: "Post archived", post: updatedPost });
  } catch (err) {
    console.error("Error archiving post:", err);
    res.status(500).json({ message: "Failed to archive post" });
  }
};

// Unarchive post - Only owner or admin
export const unarchivePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const user = await prisma.user.findUnique({ where: { id: tokenUserId } });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can unarchive posts." });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { isArchived: false },
    });

    return res.status(200).json({ message: "Post unarchived successfully", post: updatedPost });
  } catch (err) {
    console.error("Error unarchiving post:", err);
    res.status(500).json({ message: "Failed to unarchive post" });
  }
};