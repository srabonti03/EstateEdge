import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const id = req.userId;

    const { username, email, password, confirmPassword } = req.body;

    let updatedFields = {};

    const admin = await prisma.user.findUnique({
      where: { id },
    });

    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (username && username !== admin.username) {
      const existingAdmin = await prisma.user.findUnique({
        where: { username },
      });
      if (existingAdmin && existingAdmin.id !== id) {
        return res.status(400).json({ message: "Username already taken" });
      }
      updatedFields.username = username;
    }

    if (email && email !== admin.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail && existingEmail.id !== id) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updatedFields.email = email;
    }

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
      const avatarPath = `/admins/${req.file.filename}`;
      updatedFields.avatar = avatarPath;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    const updatedAdmin = await prisma.user.update({
      where: { id },
      data: updatedFields,
    });

    return res.status(200).json({
      message: "Admin profile updated successfully",
      admin: {
        id: updatedAdmin.id,
        username: updatedAdmin.username,
        email: updatedAdmin.email,
        avatar: updatedAdmin.avatar,
      },
    });
  } catch (error) {
    console.error("Admin profile update error:", error);
    return res.status(500).json({
      message: "Something went wrong while updating admin profile",
    });
  }
};
