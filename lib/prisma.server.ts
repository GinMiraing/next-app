"use server";

import Prisma from "./prisma";

export const getMoments = async (limit: number) => {
  const moments = await Prisma.moment.findMany({
    select: {
      id: true,
      content: true,
      image_url: true,
      tag: true,
      create_at: true,
    },
    where: {
      published: true,
    },
    orderBy: [
      {
        create_at: "desc",
      },
    ],
    take: limit,
  });

  const comments = await Prisma.comment.findMany({
    select: {
      id: true,
      attach_id: true,
      user_name: true,
      user_email_md5: true,
      user_site_url: true,
      user_tag: true,
      content: true,
      create_at: true,
    },
    where: {
      is_post: false,
      attach_id: {
        in: moments.map((moment) => moment.id),
      },
      published: true,
    },
    orderBy: [
      {
        create_at: "desc",
      },
    ],
  });

  const replies = await Prisma.reply.findMany({
    select: {
      id: true,
      comment_id: true,
      reply_id: true,
      reply_name: true,
      user_name: true,
      user_email_md5: true,
      user_site_url: true,
      user_tag: true,
      content: true,
      create_at: true,
    },
    where: {
      comment_id: {
        in: comments.map((comment) => comment.id),
      },
      published: true,
    },
    orderBy: [
      {
        create_at: "asc",
      },
    ],
  });

  const total = await Prisma.moment.count({
    where: {
      published: true,
    },
  });

  return {
    moments: moments.map((moment) => ({
      ...moment,
      comments: comments
        .filter((comment) => comment.attach_id === moment.id)
        .map((comment) => ({
          ...comment,
          attach_id: undefined,
          replies: replies
            .filter((reply) => reply.comment_id === comment.id)
            .map((reply) => ({
              ...reply,
              comment_id: undefined,
            })),
        })),
    })),
    total,
  };
};

export const getPosts = async (limit: number) => {
  const posts = await Prisma.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      cover_url: true,
      tag: true,
      create_at: true,
    },
    where: {
      published: true,
    },
    orderBy: [
      {
        create_at: "desc",
      },
    ],
    take: limit,
  });

  const total = await Prisma.post.count({
    where: {
      published: true,
    },
  });

  return { posts, total };
};

export const getPostById = async (id: number) => {
  const post = await Prisma.post.findUnique({
    select: {
      title: true,
      description: true,
      cover_url: true,
      md_file_url: true,
      tag: true,
      create_at: true,
    },
    where: {
      id,
      published: true,
    },
  });

  if (!post) {
    throw new Error("post not found");
  }

  return {
    ...post,
  };
};

export const getPostComments = async (postId: number) => {
  const comments = await Prisma.comment.findMany({
    select: {
      id: true,
      user_name: true,
      user_email_md5: true,
      user_site_url: true,
      user_tag: true,
      content: true,
      create_at: true,
    },
    where: {
      is_post: true,
      attach_id: postId,
      published: true,
    },
    orderBy: [
      {
        create_at: "desc",
      },
    ],
  });

  const replies = await Prisma.reply.findMany({
    select: {
      id: true,
      comment_id: true,
      reply_id: true,
      reply_name: true,
      user_name: true,
      user_email_md5: true,
      user_site_url: true,
      user_tag: true,
      content: true,
      create_at: true,
    },
    where: {
      comment_id: {
        in: comments.map((comment) => comment.id),
      },
      published: true,
    },
    orderBy: [
      {
        create_at: "asc",
      },
    ],
  });

  return comments.map((comment) => ({
    ...comment,
    replies: replies
      .filter((reply) => reply.comment_id === comment.id)
      .map((reply) => ({
        ...reply,
        comment_id: undefined,
      })),
  }));
};
