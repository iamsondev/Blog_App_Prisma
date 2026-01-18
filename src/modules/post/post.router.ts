import express from "express";
import { postController } from "./post.controller";
import auth, { useRole } from "../../middlewares/auth";
const router = express.Router();

router.post("/", auth(useRole.USER, useRole.ADMIN), postController.createPost);
router.get(
  "/stats",
  auth(useRole.ADMIN, useRole.USER),
  postController.getStats,
);
router.get("/", postController.getAllPost);
router.get(
  "/my-posts",
  auth(useRole.USER, useRole.ADMIN),
  postController.getMyPost,
);
router.get("/:postId", postController.getPostById);
router.patch(
  "/:postId",
  auth(useRole.USER, useRole.ADMIN),
  postController.updatePost,
);
router.delete(
  "/:postId",
  auth(useRole.USER, useRole.ADMIN),
  postController.deletePost,
);

export const postRouter = router;
