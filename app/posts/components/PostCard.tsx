import dayjs from "dayjs";
import { CalendarDays, Tag } from "lucide-react";
import Link from "next/link";

import { Post } from "@/lib/type";

const PostCard: React.FC<Omit<Post, "md_file_url" | "favors">> = ({
  id,
  title,
  description,
  cover_url,
  tag,
  create_at,
}) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-background shadow sm:flex-row">
      <div className="h-60 shrink-0 sm:h-60 sm:basis-1/3">
        <img
          src={cover_url}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-between space-y-4 p-6">
        <Link
          href={`/posts/${id}`}
          className="line-clamp-1 font-medium text-xl transition-colors hover:text-foreground"
        >
          {title}
        </Link>
        <Link
          href={`/posts/${id}`}
          className="line-clamp-3 text-justify leading-8 transition-colors hover:text-foreground"
        >
          {description}
        </Link>
        <div className="flex items-center space-x-5 text-sm">
          <div className="flex items-center space-x-2">
            <span>
              <CalendarDays className="h-4 w-4" />
            </span>
            <span>{dayjs(create_at).format("YYYY-MM-DD")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>
              <Tag className="h-4 w-4" />
            </span>
            <span>{tag}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
