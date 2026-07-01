import Comment from "../models/Comment.js";
import Post from "../models/post.js";

// ✅ Add comment
export const addComment = async (req, res) => {
  try {
    const { userId } = req.auth(); // Clerk middleware
    const { postId, text } = req.body;

    const comment = await Comment.create({
      post: postId,
      user: userId,
      text,
    });

    // populate username, profile_picture
    const populatedComment = await comment.populate(
      "user",
      "username full_name profile_picture"
    );

    await Post.findByIdAndUpdate(postId, {
      $inc: { comments_count: 1 },
    });

    res.json({
      success: true,
      message: "Comment added",
      comment: populatedComment,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ✅ Get comments of a post
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment
      .find({ post: postId })
      .populate("user", "username full_name profile_picture")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ✅ Edit comment
export const editComment = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { commentId, text } = req.body;

    const comment = await Comment.findOne({
      _id: commentId,
      user: userId,
    });
    if (!comment)
      return res.json({ success: false, message: "Not authorized" });

    comment.text = text;
    await comment.save();

    res.json({ success: true, message: "Comment updated", comment });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ✅ Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { commentId } = req.body;

    const comment = await Comment.findOne({
      _id: commentId,
      user: userId,
    });
    if (!comment)
      return res.json({ success: false, message: "Not authorized" });

    await Comment.deleteOne({ _id: commentId });
    await Post.findByIdAndUpdate(comment.post, {
      $inc: { comments_count: -1 },
    });

    res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
