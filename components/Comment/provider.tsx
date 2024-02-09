"use client";

import { ReactNode, createContext, useState } from "react";

import { CommentPayload } from "@/lib/schema/comment";

import CommentForm from ".";

export const CommentContext = createContext<{
  setIsPost: (isPost: boolean) => void;
  setIsReply: (isReply: boolean) => void;
  setOpen: (open: boolean) => void;
  setPayload: (payload: CommentPayload) => void;
}>({
  setIsPost: () => {},
  setIsReply: () => {},
  setOpen: () => {},
  setPayload: () => {},
});

export const CommentProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isPost, setIsPost] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<CommentPayload>({});

  return (
    <CommentContext.Provider
      value={{
        setIsPost,
        setIsReply,
        setOpen,
        setPayload,
      }}
    >
      {children}
      <CommentForm
        open={open}
        isPost={isPost}
        isReply={isReply}
        setOpen={setOpen}
        payload={payload}
      />
    </CommentContext.Provider>
  );
};
