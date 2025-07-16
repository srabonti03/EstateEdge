import prisma from "../lib/prisma.js";

// Get all chats for the current user
export const getChats = async (req, res) => {
  try {
    const currentUserId = req.userId;

    if (!currentUserId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID missing." });
    }

    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          has: currentUserId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        const otherUserIds = chat.userIDs.filter((id) => id !== currentUserId);
        const otherUsers = await prisma.user.findMany({
          where: {
            id: {
              in: otherUserIds,
            },
          },
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        });

        return {
          ...chat,
          participants: otherUsers,
        };
      })
    );

    res.status(200).json(enrichedChats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res
      .status(500)
      .json({ message: "Something went wrong while fetching chats." });
  }
};

// Get unread messages for the current user
export const unreadChat = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID missing." });
    }

    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          has: userId,
        },
        NOT: {
          seenBy: {
            has: userId,
          },
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            text: true,
            createdAt: true,
            userId: true,
          },
        },
      },
    });

    const unreadChats = chats.filter((chat) => {
      const lastMessage = chat.messages[0];
      return lastMessage && lastMessage.userId !== userId;
    });

    const enrichedChats = await Promise.all(
      unreadChats.map(async (chat) => {
        const otherUserIds = chat.userIDs.filter((id) => id !== userId);
        const participants = await prisma.user.findMany({
          where: {
            id: { in: otherUserIds },
          },
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        });

        return {
          ...chat,
          participants,
        };
      })
    );

    res.status(200).json(enrichedChats);
  } catch (error) {
    console.error("Error fetching unread chats:", error);
    res
      .status(500)
      .json({ message: "Something went wrong while fetching unread chats." });
  }
};

// Count unread chats for current user
export const countUnreadChats = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID missing." });
    }

    const unreadChatsCount = await prisma.chat.count({
      where: {
        userIDs: { has: userId },
        NOT: {
          seenBy: { has: userId },
        },
      },
    });

    const unreadChats = await prisma.chat.findMany({
      where: {
        userIDs: { has: userId },
        NOT: {
          seenBy: { has: userId },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { userId: true },
        },
      },
    });

    const filteredUnread = unreadChats.filter(
      (chat) => chat.messages[0]?.userId !== userId
    );

    res.status(200).json({ unreadCount: filteredUnread.length });
  } catch (error) {
    console.error("Error counting unread chats:", error);
    res
      .status(500)
      .json({ message: "Server error while counting unread chats." });
  }
};

// Get a specific chat and its messages
export const getChat = async (req, res) => {
  try {
    const chatId = req.params.id;
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID missing." });
    }

    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required." });
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found." });
    }

    if (!chat.userIDs?.includes(userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this chat." });
    }

    if (!chat.seenBy?.includes(userId)) {
      await prisma.chat.update({
        where: { id: chatId },
        data: { seenBy: { push: userId } },
      });
      chat.seenBy = [...(chat.seenBy || []), userId];
    }

    const otherUserIds = chat.userIDs.filter((id) => id !== userId);
    const participants = await prisma.user.findMany({
      where: {
        id: { in: otherUserIds },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    res
      .status(200)
      .json({ chat: { ...chat, participants }, messages: chat.messages });
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// Add new chat (prevent duplicate chat)
export const addChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.userId;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required." });
    }
    if (receiverId === senderId) {
      return res
        .status(400)
        .json({ message: "You cannot create a chat with yourself." });
    }

    const senderExists = await prisma.user.findUnique({
      where: { id: senderId },
    });
    const receiverExists = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!senderExists || !receiverExists) {
      return res.status(404).json({ message: "One or both users not found." });
    }

    const existingChats = await prisma.chat.findMany({
      where: {
        AND: [{ userIDs: { has: senderId } }, { userIDs: { has: receiverId } }],
      },
    });

    const existingChat = existingChats.find(
      (chat) => chat.userIDs.length === 2
    );

    if (existingChat) {
      const participants = await prisma.user.findMany({
        where: {
          id: {
            in: existingChat.userIDs.filter((id) => id !== senderId),
          },
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });

      return res
        .status(200)
        .json({
          message: "Chat already exists.",
          chat: { ...existingChat, participants },
        });
    }

    const newChat = await prisma.chat.create({
      data: {
        userIDs: [senderId, receiverId],
        seenBy: [senderId],
      },
    });

    await prisma.user.update({
      where: { id: senderId },
      data: { chatIDs: { push: newChat.id } },
    });

    await prisma.user.update({
      where: { id: receiverId },
      data: { chatIDs: { push: newChat.id } },
    });

    const participants = await prisma.user.findMany({
      where: {
        id: {
          in: [receiverId],
        },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    res
      .status(201)
      .json({
        message: "Chat created successfully.",
        chat: { ...newChat, participants },
      });
  } catch (error) {
    console.error("Error creating chat:", error);
    res
      .status(500)
      .json({
        message: error.message || "Server error. Please try again later.",
      });
  }
};

// Mark chat as read by receiving user
export const readChat = async (req, res) => {
  try {
    const chatId = req.params.id;
    const userId = req.userId;

    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required." });
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { userId: true },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found." });
    }

    if (!chat.userIDs.includes(userId)) {
      return res
        .status(403)
        .json({ message: "Access denied. You are not part of this chat." });
    }

    const lastMessageSenderId = chat.messages.length
      ? chat.messages[0].userId
      : null;

    if (lastMessageSenderId && lastMessageSenderId === userId) {
      return res
        .status(403)
        .json({
          message: "You cannot mark your own sent message chat as read.",
        });
    }

    if (chat.seenBy.includes(userId)) {
      return res
        .status(200)
        .json({ message: "Chat already marked as read.", seenBy: chat.seenBy });
    }

    await prisma.chat.update({
      where: { id: chatId },
      data: { seenBy: { push: userId } },
    });

    const updatedChat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { seenBy: true },
    });

    res
      .status(200)
      .json({ message: "Chat marked as read.", seenBy: updatedChat.seenBy });
  } catch (error) {
    console.error("Error marking chat as read:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
