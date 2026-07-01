// controllers/storyController.js
import imagekit from "../configs/imagekit.js";
import Story from "../models/story.js";
import User from "../models/user.js";
import { inngest } from "../inngest/index.js";

// Add story
export const addUserStory = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { content, media_type, background_color } = req.body;
    const media = req.file;

    let media_url = null;

    // Upload image/video to ImageKit
    if (media && (media_type === "image" || media_type === "video")) {
      const response = await imagekit.files.upload({
        file: media.buffer.toString("base64"),
        fileName: media.originalname,
        folder: "/stories",
        useUniqueFileName: true,
      });

      // Save uploaded file URL
      media_url = response.url;
    }

    // Save story in MongoDB
    const story = await Story.create({
      user: userId,
      content,
      media_url,
      media_type,
      background_color,
    });

    // Schedule auto deletion after 24 hours
    await inngest.send({
      name: "app/story.delete",
      data: {
        storyId: story._id,
      },
    });

    res.json({
      success: true,
      message: "Story created successfully",
      story,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get stories
export const getStories = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    const userIds = [userId, ...user.connections, ...user.following];

    const stories = await Story.find({ user: { $in: userIds } }).populate("user");

    res.json({ success: true, stories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete story
export const deleteStory = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { storyId } = req.params;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ success: false, message: "Story not found" });
    }

    if (story.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Story.findByIdAndDelete(storyId);

    res.json({ success: true, message: "Story deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
