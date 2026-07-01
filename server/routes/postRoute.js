// routes/postRouter.js
import express from "express";
import upload from "../configs/multer.js";
import  protect  from "../middleware/auth.js";
import { AddPost, getFeedPosts, likePost } from "../controllers/PostController.js";

const postRouter = express.Router();

postRouter.post("/add", upload.array("images", 4), protect, AddPost);
postRouter.get("/feed", protect, getFeedPosts);
postRouter.post("/like", protect, likePost);
// postRouter.delete("/:postId", protect, deletePost); // 👈 delete route


export default postRouter;
