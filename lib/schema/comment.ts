import { z } from "zod";

export const CommentCreateSchema = z.object({
  user_name: z.string().min(1),
  user_email: z.string().email(),
  user_site_url: z.union([z.string().length(0), z.string().url()]),
  content: z.string().min(1),
});

export type CommentCreateType = z.infer<typeof CommentCreateSchema>;

export type CommentPayload = {
  attachId?: number;
  commentId?: number;
  replyId?: number;
  replyName?: string;
  replyEmailMD5?: string;
  replyContent?: string;
};

export const CommentServerSchema = z.discriminatedUnion("is_reply", [
  z.object({
    is_reply: z.literal(false),
    is_post: z.boolean(),
    attach_id: z.number().int().min(0),
    user_name: z.string().min(1),
    user_email: z.string().email(),
    user_site_url: z.union([z.string().length(0), z.string().url()]),
    content: z.string().min(1),
    signature: z.string().length(64),
  }),
  z.object({
    is_reply: z.literal(true),
    comment_id: z.number().int().min(0),
    reply_id: z.number().int().min(0),
    reply_name: z.string().min(1),
    user_name: z.string().min(1),
    user_email: z.string().email(),
    user_site_url: z.union([z.string().length(0), z.string().url()]),
    content: z.string().min(1),
    signature: z.string().length(64),
  }),
]);

export type CommentServerType = z.infer<typeof CommentServerSchema>;
