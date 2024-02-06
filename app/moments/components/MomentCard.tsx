"use client";

import { Heart, MessageSquareMore } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/Avatar";

const MomentCard: React.FC = () => {
  const handleCommentBtnClick = async () => {};

  const handleLikeBtnClick = async () => {};

  return (
    <div className="w-full rounded-md border">
      <div className="flex flex-col space-y-8 p-6">
        <div className="flex space-x-6">
          <Avatar className="h-12 w-12 rounded-md">
            <AvatarImage
              src="https://placeholder.com/100x100"
              alt="100"
            />
            <AvatarFallback>胤</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-2">
            <span>胤</span>
            <span className="text-sm">2024-12-31 23:59</span>
          </div>
        </div>
        <div className="text-justify">content</div>
        <div className="flex flex-wrap">
          <div className="aspect-square basis-1/3 p-1 sm:basis-1/4">
            <img
              src="https://placeholder.com/300x200"
              className="h-full w-full object-cover"
              alt=""
            />
          </div>
          <div className="aspect-square basis-1/3 p-1 sm:basis-1/4">
            <img
              src="https://placeholder.com/300x200"
              className="h-full w-full object-cover"
              alt=""
            />
          </div>
          <div className="aspect-square basis-1/3 p-1 sm:basis-1/4">
            <img
              src="https://placeholder.com/300x200"
              className="h-full w-full object-cover"
              alt=""
            />
          </div>
          <div className="aspect-square basis-1/3 p-1 sm:basis-1/4">
            <img
              src="https://placeholder.com/300x200"
              className="h-full w-full object-cover"
              alt=""
            />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            className="flex items-center space-x-1 transition-colors hover:text-foreground"
            onClick={() => handleCommentBtnClick()}
          >
            <MessageSquareMore className="h-5 w-5" />
            <span className="text-xs">1</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-1 transition-colors hover:text-foreground"
            onClick={() => handleLikeBtnClick()}
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs">2</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MomentCard;
