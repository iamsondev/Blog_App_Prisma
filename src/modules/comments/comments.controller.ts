import { Request, Response } from "express";
import { commentService } from "./comments.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentService.createComment(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: "comment creation failed",
      details: err,
    });
  }
};

export const commentController = {
  createComment,
};
