"use client";

import { Fancybox } from "@fancyapps/ui";
import dayjs from "dayjs";
import { MessageSquareMore } from "lucide-react";
import { useCallback, useEffect } from "react";

import { BaseSetting } from "@/lib/settings";
import { Moment } from "@/lib/type";
import { cn } from "@/lib/utils";

import { useComment } from "@/components/Comment/hook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/Avatar";

import MomentComment from "./MomentComment";

const MomentCard: React.FC<{
  data: Moment;
}> = ({ data }) => {
  const { setOpen, setIsPost, setIsReply, setPayload } = useComment();

  const handleComment = useCallback(() => {
    setIsPost(false);
    setIsReply(false);
    setPayload({
      attachId: data.id,
    });
    setOpen(true);
  }, [data]);

  const images = data.image_url.split(",").filter((str) => str.length > 0);

  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
      groupAll: true,
      Thumbs: false,
      Carousel: {
        transition: "slide",
      },
      Images: {
        zoom: false,
      },
      showClass: "f-fadeSlowIn",
      hideClass: "f-fadeSlowOut",
      wheel: "slide",
      Toolbar: {
        display: {
          left: [],
          middle: [],
          right: ["close"],
        },
      },
    });

    return () => {
      Fancybox.unbind("[data-fancybox]");
      Fancybox.close();
    };
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-md border bg-background shadow">
      <div
        className={cn("flex flex-col space-y-8 p-6", {
          "border-b-2 border-dashed border-gray-400": data.comments.length > 0,
        })}
      >
        <div className="flex space-x-6">
          <Avatar className="h-12 w-12 rounded-md border-2">
            <AvatarImage
              src={BaseSetting.avatar}
              alt={BaseSetting.avatar}
            />
            <AvatarFallback>胤</AvatarFallback>
          </Avatar>
          <div className="flex h-12 flex-col justify-between">
            <span>胤</span>
            <span className="text-sm">
              {dayjs(data.create_at).format("YYYY-MM-DD HH:mm")}
            </span>
          </div>
        </div>
        <p className="whitespace-pre text-wrap text-justify text-sm/8 sm:text-base/8">
          {data.content}
        </p>
        {images.length > 0 && (
          <div className="flex flex-wrap">
            {images.map((image) => (
              <a
                key={image}
                href={image}
                data-fancybox
                className="aspect-square basis-1/3 p-1 transition-all hover:brightness-75 sm:basis-1/4"
              >
                <img
                  src={`${image}/post_thumb`}
                  className="h-full w-full object-cover"
                  alt={image}
                />
              </a>
            ))}
          </div>
        )}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            className="flex items-center space-x-1 transition-colors hover:text-foreground"
            onClick={() => handleComment()}
          >
            <MessageSquareMore className="h-5 w-5" />
            {data.comments.length > 0 && (
              <span className="text-xs">{data.comments.length}</span>
            )}
          </button>
        </div>
      </div>
      {data.comments.length > 0 && <MomentComment data={data.comments} />}
    </div>
  );
};

export default MomentCard;
