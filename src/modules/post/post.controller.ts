import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { useRole } from "../../middlewares/auth";
import { boolean } from "better-auth/*";

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
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
          ? false
          : undefined
      : undefined;
    const status = req.query.status as PostStatus | undefined;
    const authorId = req.query.authorId as string;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper({
      page: req.query.page as string,
      limit: req.query.limit as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as string,
    });

    const result = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({
      error: "Post creation failed",
      details: err?.message || err,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("not found the id");
    }
    const result = await postService.getPostById(postId);
    res.status(200).json({ result });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};
const getMyPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    console.log(user);
    if (!user) {
      throw new Error("you are unauthorized");
    }
    const result = await postService.getMyPost(user.id);
    res.status(200).json({ result });
  } catch (e) {
    res.status(400).json({
      error: "post fetch failed",
      details: e,
    });
  }
};
const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    console.log(user);
    if (!user) {
      throw new Error("you are unauthorized");
    }
    const { postId } = req.params;
    const isAdmin = user.role === useRole.ADMIN;
    const result = await postService.updatePost(
      postId as string,
      req.body,
      user.id,
      isAdmin,
    );
    res.status(200).json({ result });
  } catch (e) {
    res.status(400).json({
      error: "post update failed",
      details: e,
    });
  }
};
const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    console.log(user);
    if (!user) {
      throw new Error("you are unauthorized");
    }
    const { postId } = req.params;
    const isAdmin = user.role === useRole.ADMIN;
    const result = await postService.deletePost(
      postId as string,
      user.id,
      isAdmin,
    );
    res.status(200).json({ result });
  } catch (e) {
    res.status(400).json({
      error: "you are not owner of this post",
      details: e,
    });
  }
};
const getStats = async (req: Request, res: Response) => {
  try {
    const result = await postService.getStats();
    res.status(200).json({ result });
  } catch (e) {
    res.status(400).json({
      error: "unable to get statistics",
      details: e,
    });
  }
};

export const postController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPost,
  updatePost,
  deletePost,
  getStats,
};
