import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import { getPosts } from "@/lib/prisma.server";
import { Post } from "@/lib/type";
import { sleep } from "@/lib/utils";

import LoadMore from "./components/LoadMore";
import PostCard from "./components/PostCard";

export default async function Page({
  searchParams,
}: {
  searchParams: { size?: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
          <Loader2 className="mr-2 animate-spin" />
          加载中...
        </div>
      }
    >
      <StreamLoader size={searchParams.size ? Number(searchParams.size) : 1} />
    </Suspense>
  );
}

const StreamLoader: React.FC<{
  size: number;
}> = async ({ size }) => {
  const { posts } = await getPosts(size);

  return (
    <div className="py-4 sm:py-10">
      <div className="flex flex-col space-y-8">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
          />
        ))}
      </div>
      <LoadMore size={posts.length} />
    </div>
  );
};
