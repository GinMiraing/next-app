"use client";

import dayjs from "dayjs";
import { MessageSquareMore } from "lucide-react";
import { useCallback } from "react";

import { useComment } from "@/components/Comment/hook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/Avatar";
import { useUser } from "@/components/User/hook";

const MomentComment: React.FC<{
  data: {
    id: number;
    user_name: string;
    user_email_md5: string;
    user_site_url: string;
    user_tag: string;
    content: string;
    create_at: Date;
    replies: {
      id: number;
      reply_id: number;
      reply_name: string;
      user_name: string;
      user_email_md5: string;
      user_site_url: string;
      user_tag: string;
      content: string;
      create_at: Date;
    }[];
  }[];
}> = ({ data }) => {
  const { setIsPost, setIsReply, setOpen, setPayload } = useComment();
  const { isLogin, setUserFormOpen } = useUser();

  const handlerReply = useCallback(
    (payload: {
      commentId: number;
      replyId: number;
      replyName: string;
      replyEmailMD5: string;
      replyContent: string;
    }) => {
      if (!isLogin) {
        setUserFormOpen(true);
        return;
      }

      setIsPost(false);
      setIsReply(true);
      setPayload(payload);
      setOpen(true);
    },
    [isLogin],
  );

  return (
    <div className="space-y-4 bg-slate-100 p-6">
      {data.map((comment) => (
        <div
          className="space-y-4"
          key={comment.id}
          id={comment.id.toString()}
        >
          <div className="flex space-x-3">
            <Avatar className="h-11 w-11 rounded-md">
              <AvatarImage
                src={`https://cravatar.cn/avatar/${comment.user_email_md5}`}
                alt={comment.user_email_md5}
              />
              <AvatarFallback>{comment.user_name}</AvatarFallback>
            </Avatar>
            <div className="flex h-11 flex-col justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{comment.user_name}</span>
                {comment.user_tag && (
                  <span className="rounded bg-green-200 px-1 py-0.5 text-xs">
                    {comment.user_tag}
                  </span>
                )}
                <button
                  onClick={() =>
                    handlerReply({
                      commentId: comment.id,
                      replyId: 0,
                      replyName: comment.user_name,
                      replyEmailMD5: comment.user_email_md5,
                      replyContent: comment.content,
                    })
                  }
                  type="button"
                >
                  <MessageSquareMore className="h-4 w-4 transition-colors hover:text-foreground" />
                </button>
              </div>
              <span className="text-xs">
                {dayjs(comment.create_at).format("YYYY-MM-DD HH:mm")}
              </span>
            </div>
          </div>
          <p className="ml-14 whitespace-pre-wrap break-all text-justify text-sm/7 sm:text-base/8">
            {comment.content}
          </p>
          {comment.replies.map((reply) => (
            <div
              className="ml-14 space-y-4"
              key={reply.id}
              id={reply.id.toString()}
            >
              <div className="flex space-x-3">
                <Avatar className="h-11 w-11 rounded-md">
                  <AvatarImage
                    src={`https://cravatar.cn/avatar/${reply.user_email_md5}`}
                    alt={reply.user_email_md5}
                  />
                  <AvatarFallback>{reply.user_name}</AvatarFallback>
                </Avatar>
                <div className="flex h-11 flex-col justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{reply.user_name}</span>
                    {reply.user_tag && (
                      <span className="rounded bg-green-200 px-1 py-0.5 text-xs">
                        {reply.user_tag}
                      </span>
                    )}
                    <button
                      onClick={() =>
                        handlerReply({
                          commentId: comment.id,
                          replyId: reply.id,
                          replyName: reply.user_name,
                          replyEmailMD5: reply.user_email_md5,
                          replyContent: reply.content,
                        })
                      }
                      type="button"
                    >
                      <MessageSquareMore className="h-4 w-4 transition-colors hover:text-foreground" />
                    </button>
                  </div>
                  <span className="text-xs">
                    {dayjs(reply.create_at).format("YYYY-MM-DD HH:mm")}
                  </span>
                </div>
              </div>
              <p className="ml-14 whitespace-pre-wrap break-all text-justify text-sm/7 sm:text-base/8">
                <a
                  className="mr-2 bg-red-200 px-1 transition-colors hover:text-foreground"
                  href={`#${reply.reply_id === 0 ? comment.id : reply.reply_id}`}
                >
                  @{reply.reply_name}
                </a>
                {reply.content}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MomentComment;
