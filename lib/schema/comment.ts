import { z } from "zod";

export const CommentCreateSchema = z.object({
  content: z.string().min(1, "评论内容不得为空"),
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
    content: z.string().min(1),
    signature: z.string().length(64),
  }),
  z.object({
    is_reply: z.literal(true),
    comment_id: z.number().int().min(0),
    reply_id: z.number().int().min(0),
    reply_name: z.string().min(1),
    content: z.string().min(1),
    signature: z.string().length(64),
  }),
]);

export type CommentServerType = z.infer<typeof CommentServerSchema>;
