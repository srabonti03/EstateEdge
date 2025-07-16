import prisma from "../lib/prisma.js";

// Add a message to a chat
export const addMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const chatId = req.params.id || req.body.chatId;
    const { text } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. User ID missing." });
    }

    if (!chatId || !text) {
      return res.status(400).json({ message: "chatId and text are required." });
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found." });
    }

    if (!chat.userIDs.includes(userId)) {
      return res.status(403).json({ message: "Access denied. You are not part of this chat." });
    }

    const newMessage = await prisma.message.create({
      data: {
        text,
        userId,
        chatId,
      },
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastMessage: text,
        seenBy: {
          push: userId,
        },
      },
    });

    res.status(201).json({
      message: "Message sent successfully.",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
