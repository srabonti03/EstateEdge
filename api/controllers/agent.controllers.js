import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

// Get all agents information
export const getAllAgents = async (req, res) => {
  try {
    const agents = await prisma.user.findMany({
      where: { role: "agent" },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        phone: true,
        location: true,
        bio: true,
        agentTitle: true,
        createdAt: true,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!agents.length) {
      return res.status(404).json({ message: "No agents found." });
    }

    const agentsWithCounts = await Promise.all(
      agents.map(async (agent) => {
        const listingsCount = await prisma.post.count({
          where: { userId: agent.id },
        });

        return {
          ...agent,
          listingCount: listingsCount,
        };
      })
    );

    res.status(200).json(agentsWithCounts);
  } catch (error) {
    console.error("Error fetching agents with listing counts:", error);
    res.status(500).json({ message: "Something went wrong while fetching agents." });
  }
};

// Get total number of agents in the system
export const getTotalAgentsCount = async (req, res) => {
  try {
    const totalAgents = await prisma.user.count({
      where: { role: "agent" },
    });

    res.status(200).json({ totalAgents });
  } catch (error) {
    console.error("Error fetching total agents count:", error);
    res.status(500).json({ message: "Failed to get total agents count." });
  }
};

// Get specific agent information
export const getAgentById = async (req, res) => {
  const { id } = req.params;

  try {
    const agent = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        phone: true,
        location: true,
        bio: true,
        agentTitle: true,
        role: true,
        createdAt: true,
      },
    });

    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ message: "Agent not found." });
    }

    const listingCount = await prisma.post.count({
      where: { userId: id },
    });

    res.status(200).json({ ...agent, listingCount });
  } catch (error) {
    console.error("Error fetching agent by ID:", error);
    res.status(500).json({ message: "Something went wrong while fetching agent." });
  }
};

// Update specific agent title
export const updateAgent = async (req, res) => {
  console.log("Role from token:", req.userRole);
  if (req.userRole !== "admin") return res.status(403).json({ message: "Access denied: Admins only." });

  const { id } = req.params;
  const { agentTitle } = req.body;

  try {
    const updatedAgent = await prisma.user.update({
      where: { id },
      data: { agentTitle },
    });
    res.json(updatedAgent);
  } catch (error) {
    res.status(500).json({ message: "Update failed." });
  }
};

// Make agent inactive
export const deactivateAgent = async (req, res) => {
  console.log("Role from token:", req.userRole);
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only." });
  }

  const { id } = req.params;

  try {
    const agent = await prisma.user.findUnique({
      where: { id },
    });

    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ message: "Agent not found." });
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: "Agent has been deactivated. Existing posts are intact." });
  } catch (error) {
    console.error("Error deactivating agent:", error);
    res.status(500).json({ message: "Failed to deactivate agent.", error: error.message });
  }
};

// Reactivate agent
export const reactivateAgent = async (req, res) => {
  console.log("Role from token:", req.userRole);
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only." });
  }

  const { id } = req.params;

  try {
    const agent = await prisma.user.findUnique({
      where: { id },
    });

    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ message: "Agent not found." });
    }

    if (agent.isActive) {
      return res.status(400).json({ message: "Agent is already active." });
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: true },
    });

    res.json({ message: "Agent has been reactivated successfully." });
  } catch (error) {
    console.error("Error reactivating agent:", error);
    res.status(500).json({ message: "Failed to reactivate agent.", error: error.message });
  }
};

// Update agent profile
export const updateAgentProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      username,
      location,
      phone,
      email,
      bio,
      password,
      confirmPassword,
    } = req.body;

    let updatedFields = {};

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username && username !== user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "Username already taken" });
      }
      updatedFields.username = username;
    }

    if (email && email !== user.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail && existingEmail.id !== userId) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updatedFields.email = email;
    }

    if (location) updatedFields.location = location;
    if (phone) updatedFields.phone = phone;
    if (bio) updatedFields.bio = bio;

    if (password || confirmPassword) {
      if (!password || !confirmPassword) {
        return res.status(400).json({
          message: "Both password and confirm password are required",
        });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    if (req.file) {
      const avatarPath = `/agents/${req.file.filename}`;
      updatedFields.avatar = avatarPath;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedFields,
    });

    return res.status(200).json({
      message: "User profile updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        location: updatedUser.location,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.error("User profile update error:", error);
    return res.status(500).json({
      message: "Something went wrong while updating user profile",
    });
  }
};