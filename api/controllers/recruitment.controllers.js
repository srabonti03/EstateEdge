import prisma from "../lib/prisma.js";

const allowedAgentTitles = [
  "real_estate_agent",
  "senior_property_consultant",
  "residential_property_expert",
  "luxury_apartment_specialist",
  "commercial_space_advisor",
  "senior_leasing_agent",
  "urban_property_strategist",
  "modern_housing_consultant",
  "plot_land_advisor",
  "real_estate_investment_consultant",
  "luxury_villa_specialist",
  "real_estate_legal_advisor",
  "land_farm_property_specialist",
  "commercial_real_estate_agent",
  "luxury_property_specialist",
  "plot_development_consultant",
  "residential_property_broker",
  "senior_real_estate_consultant",
  "investment_properties_consultant",
];

function parseDDMMYYYY(dateStr) {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;

  const [dd, mm, yyyy] = parts;
  const date = new Date(`${yyyy}-${mm}-${dd}`);
  if (isNaN(date.getTime())) return null;
  return date;
}

// Get all recruitment made for admin and agent
export const getRecruitments = async (req, res) => {
  try {
    const { role: queryRole, location } = req.query;
    const userRole = req.userRole || req.user?.role;

    const filters = {};

    if (queryRole) {
      if (!["agent", "admin"].includes(queryRole)) {
        return res.status(400).json({ message: "Invalid role filter. Must be 'agent' or 'admin'." });
      }
      filters.role = queryRole;
    }

    if (location) {
      filters.location = location;
    }
    if (userRole !== "admin") {
      filters.isDisabled = false;
    }

    const recruitments = await prisma.recruitment.findMany({
      where: filters,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ recruitments });
  } catch (err) {
    console.error("Error fetching recruitments:", err);
    res.status(500).json({ message: "Failed to fetch recruitment posts." });
  }
};

// Get a single recruitment post by ID (accessible to all users)
export const getRecruitmentPostById = async (req, res) => {
  const recruitmentId = req.params.id;

  try {
    const recruitmentPost = await prisma.recruitment.findUnique({
      where: { id: recruitmentId },
    });

    if (!recruitmentPost) {
      return res.status(404).json({ message: "Recruitment post not found." });
    }

    res.status(200).json({
      message: "Recruitment post fetched successfully.",
      recruitment: recruitmentPost,
    });
  } catch (err) {
    console.error("Error fetching recruitment post:", err);
    res.status(500).json({ message: "Something went wrong while fetching recruitment post." });
  }
};

// Recruit for new admin or agent
export const recruitmentPost = async (req, res) => {
  const userId = req.userId;
  const { title, description, role, agentTitle, location, deadline, positionsAvailable } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create recruitment posts." });
    }

    if (!deadline) {
      return res.status(400).json({ message: "Deadline is required." });
    }

    const parsedDeadline = parseDDMMYYYY(deadline);
    if (!parsedDeadline) {
      return res.status(400).json({ message: "Invalid deadline date format. Use dd-mm-yyyy." });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDeadline < today) {
      return res.status(400).json({ message: "Deadline cannot be in the past." });
    }

    if (!["agent", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be 'agent' or 'admin'." });
    }

    if (role === "agent" && (!agentTitle || !allowedAgentTitles.includes(agentTitle))) {
      return res.status(400).json({ message: "Invalid or missing agentTitle for agent recruitment." });
    }

    if (!location || typeof location !== "string") {
      return res.status(400).json({ message: "Location is required and must be a string." });
    }

    if (positionsAvailable !== undefined && typeof positionsAvailable !== "number") {
      return res.status(400).json({ message: "positionsAvailable must be a number." });
    }

    const existingPost = await prisma.recruitment.findFirst({
      where: {
        title,
        role,
        location,
      },
    });

    if (existingPost) {
      return res.status(409).json({ message: "A recruitment post with the same title, role, and location already exists." });
    }

    const newRecruitment = await prisma.recruitment.create({
      data: {
        title,
        description,
        role,
        location,
        postedDay: new Date(),
        createdAt: new Date(),
        deadline: parsedDeadline,
        ...(role === "agent" && { agentTitle }),
        ...(positionsAvailable !== undefined && { positionsAvailable }),
      },
    });

    res.status(201).json({
      message: "Recruitment post created successfully.",
      id: newRecruitment.id,
    });
  } catch (err) {
    console.error("Error creating recruitment post:", err);
    res.status(500).json({ message: "Something went wrong while creating recruitment post." });
  }
};

// Update existing recruitment post by ID (only admin)
export const updateRecruitmentPost = async (req, res) => {
  const userId = req.userId;
  const recruitmentId = req.params.id;
  const { title, description, role, agentTitle, location, deadline, positionsAvailable } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update recruitment posts." });
    }

    const existingPost = await prisma.recruitment.findUnique({ where: { id: recruitmentId } });
    if (!existingPost) {
      return res.status(404).json({ message: "Recruitment post not found." });
    }

    let parsedDeadline;
    if (deadline) {
      parsedDeadline = parseDDMMYYYY(deadline);
      if (!parsedDeadline) {
        return res.status(400).json({ message: "Invalid deadline date format. Use dd-mm-yyyy." });
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsedDeadline < today) {
        return res.status(400).json({ message: "Deadline cannot be in the past." });
      }
    }

    if (role && !["agent", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be 'agent' or 'admin'." });
    }

    if (role === "agent" && (!agentTitle || !allowedAgentTitles.includes(agentTitle))) {
      return res.status(400).json({ message: "Invalid or missing agentTitle for agent recruitment." });
    }

    if (location && typeof location !== "string") {
      return res.status(400).json({ message: "Location must be a string." });
    }

    if (positionsAvailable !== undefined && typeof positionsAvailable !== "number") {
      return res.status(400).json({ message: "positionsAvailable must be a number." });
    }

    if (
      (title && title !== existingPost.title) ||
      (role && role !== existingPost.role) ||
      (location && location !== existingPost.location)
    ) {
      const duplicate = await prisma.recruitment.findFirst({
        where: {
          id: { not: recruitmentId },
          title: title ?? existingPost.title,
          role: role ?? existingPost.role,
          location: location ?? existingPost.location,
        },
      });
      if (duplicate) {
        return res.status(409).json({ message: "Another recruitment post with the same title, role, and location already exists." });
      }
    }

    const updateData = {};

    if (title && title !== existingPost.title) updateData.title = title;
    if (description && description !== existingPost.description) updateData.description = description;
    if (role && role !== existingPost.role) updateData.role = role;
    if (location && location !== existingPost.location) updateData.location = location;

    if (deadline) {
      const existingDeadline = existingPost.deadline ? new Date(existingPost.deadline) : null;
      if (!existingDeadline || parsedDeadline.getTime() !== existingDeadline.getTime()) {
        updateData.deadline = parsedDeadline;
      }
    }

    if (role === "agent" && agentTitle && agentTitle !== existingPost.agentTitle) {
      updateData.agentTitle = agentTitle;
    }

    if (positionsAvailable !== undefined && positionsAvailable !== existingPost.positionsAvailable) {
      updateData.positionsAvailable = positionsAvailable;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No changes detected to update." });
    }

    const updatedRecruitment = await prisma.recruitment.update({
      where: { id: recruitmentId },
      data: updateData,
    });

    res.status(200).json({
      message: "Recruitment post updated successfully.",
      recruitment: updatedRecruitment,
    });
  } catch (err) {
    console.error("Error updating recruitment post:", err);
    res.status(500).json({ message: "Something went wrong while updating recruitment post." });
  }
};

// Delete recruitment post by ID (admin only)
export const deleteRecruitmentPost = async (req, res) => {
  const userId = req.userId;
  const recruitmentId = req.params.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete recruitment posts." });
    }

    const existingPost = await prisma.recruitment.findUnique({ where: { id: recruitmentId } });
    if (!existingPost) {
      return res.status(404).json({ message: "Recruitment post not found." });
    }

    await prisma.application.deleteMany({
      where: { recruitmentId }
    });

    await prisma.recruitment.delete({
      where: { id: recruitmentId }
    });

    res.status(200).json({ message: "Recruitment post and all applications deleted. Accepted users remain upgraded." });
  } catch (err) {
    console.error("Error deleting recruitment post:", err);
    res.status(500).json({ message: "Something went wrong while deleting recruitment post." });
  }
};

// Disable recruitment post (admin only)
export const disableRecruitmentPost = async (req, res) => {
  const userId = req.userId;
  const recruitmentId = req.params.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can disable recruitment posts." });
    }

    const existingPost = await prisma.recruitment.findUnique({ where: { id: recruitmentId } });
    if (!existingPost) {
      return res.status(404).json({ message: "Recruitment post not found." });
    }

    const updated = await prisma.recruitment.update({
      where: { id: recruitmentId },
      data: { isDisabled: true },
    });

    res.status(200).json({ message: "Recruitment post disabled (turned off).", recruitment: updated });
  } catch (err) {
    console.error("Error disabling recruitment post:", err);
    res.status(500).json({ message: "Failed to disable recruitment post." });
  }
};

// Enable recruitment post (admin only)
export const enableRecruitmentPost = async (req, res) => {
  const userId = req.userId;
  const recruitmentId = req.params.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can enable recruitment posts." });
    }

    const existingPost = await prisma.recruitment.findUnique({ where: { id: recruitmentId } });
    if (!existingPost) {
      return res.status(404).json({ message: "Recruitment post not found." });
    }

    const updated = await prisma.recruitment.update({
      where: { id: recruitmentId },
      data: { isDisabled: false },
    });

    res.status(200).json({ message: "Recruitment post enabled (turned on).", recruitment: updated });
  } catch (err) {
    console.error("Error enabling recruitment post:", err);
    res.status(500).json({ message: "Failed to enable recruitment post." });
  }
};

// Handles authenticated user applications to recruitment posts by saving their info and documents.
export const applyForRecruitment = async (req, res) => {
  try {
    const userId = req.userId;
    const recruitmentId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID." });
    }

    const {
      fullName,
      email,
      phone,
      cvLink,
      portfolioLink,
      coverLetter,
    } = req.body;

    if (!fullName || !email || !phone || !cvLink) {
      return res.status(400).json({ message: "Required fields missing." });
    }

    const existing = await prisma.application.findFirst({
      where: {
        userId: String(userId),
        recruitmentId: String(recruitmentId),
      },
    });

    if (existing) {
      return res.status(409).json({ message: "You already applied to this post." });
    }

    const application = await prisma.application.create({
      data: {
        userId: String(userId),
        recruitmentId: String(recruitmentId),
        fullName,
        email,
        phone,
        cvLink,
        portfolioLink,
        coverLetter,
      },
    });

    res.status(201).json({ message: "Application submitted.", application });
  } catch (error) {
    console.error("Apply Error:", error);
    res.status(500).json({ message: "Failed to submit application." });
  }
};

// All applied applicants informations, but count only accepted or pending
export const getApplicantsForRecruitment = async (req, res) => {
  try {
    const recruitmentId = req.params.id;

    const applications = await prisma.application.findMany({
      where: { recruitmentId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            phone: true,
            role: true,
            agentTitle: true,
            location: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    const applicantCount = await prisma.application.count({
      where: {
        recruitmentId,
        status: {
          in: ['accepted', 'pending'],
        },
      },
    });

    res.status(200).json({
      totalApplicants: applicantCount,
      applications,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Failed to fetch applicants." });
  }
};

// Single applicants information
export const getSingleApplicantForRecruitment = async (req, res) => {
  try {
    const { recruitmentId, userId } = req.params;

    const application = await prisma.application.findFirst({
      where: {
        recruitmentId,
        userId,
      },
      include: {
        user: true,
        recruitment: true,
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (application.user.role === 'user') {
      delete application.user.agentTitle;
    }

    res.status(200).json({ application });
  } catch (error) {
    console.error("Error fetching applicant:", error);
    res.status(500).json({ message: "Failed to fetch applicant." });
  }
};

// Update application status (accept, reject, or pending)
export const updateApplicationStatus = async (req, res) => {
  try {
    const adminId = req.userId;
    const { applicationId } = req.params;
    const { action } = req.body;

    const adminUser = await prisma.user.findUnique({ where: { id: adminId } });
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update applications." });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        recruitment: true,
        user: true,
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if ((action === "accept" || action === "reject") && application.status !== "pending") {
      return res.status(400).json({ message: "This application has already been processed." });
    }

    if (action === "accept") {
      const newRole = application.recruitment.role;

      const updatedUserData = { role: newRole };

      if (newRole === "agent" && application.recruitment.agentTitle) {
        updatedUserData.agentTitle = application.recruitment.agentTitle;
      } else {
        updatedUserData.agentTitle = null;
      }

      await prisma.user.update({
        where: { id: application.userId },
        data: updatedUserData,
      });

      await prisma.application.update({
        where: { id: applicationId },
        data: { status: "accepted" },
      });

      const updatedRecruitment = await prisma.recruitment.update({
        where: { id: application.recruitment.id },
        data: {
          positionsAvailable: {
            decrement: 1,
          },
        },
      });

      if (updatedRecruitment.positionsAvailable <= 0) {
        await prisma.recruitment.delete({
          where: { id: updatedRecruitment.id },
        });
      }

      return res.status(200).json({ message: "Application accepted and user upgraded." });
    } 
    else if (action === "reject") {
      await prisma.application.delete({
        where: { id: applicationId },
      });

      return res.status(200).json({ message: "Application rejected." });
    } 
    else if (action === "pending") {
      if (application.status === "pending") {
        return res.status(400).json({ message: "Application is already pending." });
      }

      await prisma.application.update({
        where: { id: applicationId },
        data: { status: "pending" },
      });

      return res.status(200).json({ message: "Application status reset to pending." });
    } 
    else {
      return res.status(400).json({ message: "Invalid action. Must be 'accept', 'reject', or 'pending'." });
    }
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Failed to update application status." });
  }
};
