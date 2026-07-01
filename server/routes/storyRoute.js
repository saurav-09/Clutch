import express from "express";
import upload from "../configs/multer.js";
import  protect  from "../middleware/auth.js";
import { addUserStory, getStories, deleteStory } from "../controllers/storyController.js";

const storyRouter = express.Router();

storyRouter.post("/create", protect, upload.single("media"), addUserStory);
storyRouter.get("/get", protect, getStories);
storyRouter.delete("/:storyId", protect, deleteStory);

export default storyRouter;
