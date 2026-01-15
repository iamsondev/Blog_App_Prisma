import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });
  if (payload.parentId) {
    await prisma.comment.findFirstOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }
  return await prisma.comment.create({
    data: payload,
  });
};

const getCommentById = async (commentId: string) => {
  return await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
};

const getCommentByAuthorId = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

const deleteComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
  });
  if (!commentData) {
    throw new Error("There are no comment");
  }
  return await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
};

const updateComment = async (
  commentId: string,
  data: { content?: string; status?: CommentStatus },
  authorId: string
) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
  });
  if (!commentData) {
    throw new Error("comment update failed");
  }
  return await prisma.comment.update({
    where: {
      id: commentId,
    },
    data,
  });
};

const moderateComment = async (id: string, data: { status: CommentStatus }) => {
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (commentData.status === data.status) {
    throw new Error(
      `Your provided status (${data.status}) is already up to date.`
    );
  }

  return await prisma.comment.update({
    where: {
      id,
    },
    data,
  });
};
export const commentService = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  deleteComment,
  updateComment,
  moderateComment,
};
