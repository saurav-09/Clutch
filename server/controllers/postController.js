import imagekit from "../configs/imagekit.js";
import Post from "../models/post.js";
import User from "../models/user.js";

// Add post with multiple images
export const AddPost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, post_type } = req.body;
    const images = req.files;
    let image_urls = [];

    if (images && images.length > 0) {
      image_urls = await Promise.all(
        images.map(async (img) => {
          const response = await imagekit.files.upload({
            file: img.buffer.toString("base64"),
            fileName: img.originalname,
            folder: "/posts",
            useUniqueFileName: true,
          });
          return response.url;
        }),
      );
    }

    await Post.create({
      user: userId,
      content,
      image_urls,
      post_type,
    });

    res.json({ success: true, message: "Post created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get feed posts
export const getFeedPosts = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    const userIds = [userId, ...user.connections, ...user.following];

    const posts = await Post.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like/unlike post
export const likePost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.likes_count.includes(userId)) {
      post.likes_count = post.likes_count.filter((id) => id.toString() !== userId);
      await post.save();
      return res.json({ success: true, message: "Post unliked" });
    } else {
      post.likes_count.push(userId);
      await post.save();
      return res.json({ success: true, message: "Post liked" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};