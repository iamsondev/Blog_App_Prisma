import express from "express";
import { postController } from "./post.controller";
import auth, { useRole } from "../../middlewares/auth";
const router = express.Router();

router.get("/", postController.getAllPost);
router.post("/", auth(useRole.USER), postController.createPost);

export const postRouter = router;
