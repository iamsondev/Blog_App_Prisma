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

router.patch(
  "/:commentId",
  auth(useRole.USER, useRole.ADMIN),
  commentController.updateComment
);
export const commentRouter = router;
