import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

// Get total customer count
export const getTotalCustomerCount = async (req, res) => {
  try {
    const count = await prisma.user.count({
      where: { role: "user" },
    });

    res.status(200).json({ totalCustomers: count });
  } catch (error) {
    console.error("Error fetching customer count:", error);
    res
      .status(500)
      .json({ message: "Something went wrong while fetching customer count." });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const { new_username, new_email, new_password, confirm_password } =
      req.body;
    let updatedFields = {};

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (new_username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: new_username },
      });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "Username already taken" });
      }
      updatedFields.username = new_username;
    }

    if (new_email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: new_email },
      });
      if (existingEmail && existingEmail.id !== userId) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updatedFields.email = new_email;
    }

    if (new_password || confirm_password) {
      if (!new_password || !confirm_password) {
        return res
          .status(400)
          .json({ message: "Both password and confirm password are required" });
      }
      if (new_password !== confirm_password) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      const hashedPassword = await bcrypt.hash(new_password, 10);
      updatedFields.password = hashedPassword;
    }

    if (req.file) {
      const newAvatarPath = `/users/${req.file.filename}`;
      updatedFields.avatar = newAvatarPath;
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

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong while updating profile" });
  }
};