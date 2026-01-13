import express from "express";
import { postController } from "./post.controller";
import auth, { useRole } from "../../middlewares/auth";
const router = express.Router();

router.post("/", auth(useRole.USER), postController.createPost);
router.get("/", postController.getAllPost);
router.get("/:postId", postController.getPostById);

export const postRouter = router;
