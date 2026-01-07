import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        error: "unauthorized",
      });
    }
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: "failed to fetch post",
      details: err,
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const result = await postService.getAllPost({ search: searchString, tags });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({
      error: "Post creation failed",
      details: err?.message || err,
    });
  }
};
export const postController = {
  createPost,
  getAllPost,
};
