// controllers/messageController.js
import imagekit from "../configs/imagekit.js";
import Message from "../models/message.js";

let connections = {}; // SSE clients

// SSE connection
export const sseController = (req, res) => {
  const { userId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  connections[userId] = res;
  res.write("log: Connected\n\n");

  req.on("close", () => delete connections[userId]);
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { to_user_id, text } = req.body;
    const file = req.file;

    let media_url = null;
    let message_type = "text";

    if (file) {
      const response = await imagekit.files.upload({
        file: file.buffer.toString("base64"),
        fileName: file.originalname,
        folder: "/messages",
        useUniqueFileName: true,
      });

      if (file.mimetype.startsWith("image")) {
        message_type = "image";
      } else if (file.mimetype.startsWith("video")) {
        message_type = "video";
      }

      media_url = response.url;
    }

    const message = await Message.create({
      from_user_id: userId,
      to_user_id,
      text,
      message_type,
      media_url,
    });

    if (connections[to_user_id]) {
      connections[to_user_id].write(
        `data: ${JSON.stringify(message)}\n\n`
      );
    }

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get chat messages
export const getChatMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id } = req.body;

    const messages = await Message
      .find({ $or: [{ from_user_id: userId, to_user_id }, { from_user_id: to_user_id, to_user_id: userId }] })
      .sort({ createdAt: -1 });

    await Message.updateMany({ from_user_id: to_user_id, to_user_id: userId }, { seen: true });

    res.json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's recent messages
export const getUserRecentMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const messages = await Message
      .find({ to_user_id: userId })
      .populate("from_user_id to_user_id")
      .sort({ createdAt: -1 });

    res.json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

