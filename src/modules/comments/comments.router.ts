import express from "express";
import { commentController } from "./comments.controller";
import auth, { useRole } from "../../middlewares/auth";
const router = express.Router();

router.post(
  "/",
  auth(useRole.USER, useRole.ADMIN),
  commentController.createComment
);

router.get("/:commentId", commentController.getCommentById);
router.get("/author/:authorId", commentController.getCommentByAuthorId);
router.delete(
  "/:commentId",
  auth(useRole.USER, useRole.ADMIN),
  commentController.deleteComment
);
export const commentRouter = router;
