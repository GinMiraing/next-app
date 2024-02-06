import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import { Post } from "@/lib/type";
import { sleep } from "@/lib/utils";

import LoadMore from "./components/LoadMore";
import PostCard from "./components/PostCard";

const mocks: Post[] = [
  {
    id: 1,
    title: "mock 1",
    description: "mock 1",
    timestamp: 1707184711,
    tag: "test",
    mdFileUrl: "",
    coverUrl: "https://placeholder.com/300x200",
  },
  {
    id: 2,
    title: "mock 2",
    description: "mock 2",
    timestamp: 1707184711,
    tag: "test",
    mdFileUrl: "",
    coverUrl: "https://placeholder.com/300x200",
  },
  {
    id: 3,
    title: "mock 3",
    description: "mock 3",
    timestamp: 1707184711,
    tag: "test",
    mdFileUrl: "",
    coverUrl: "https://placeholder.com/300x200",
  },
  {
    id: 4,
    title: "mock 4",
    description: "mock 4",
    timestamp: 1707184711,
    tag: "test",
    mdFileUrl: "",
    coverUrl: "https://placeholder.com/300x200",
  },
  {
    id: 5,
    title: "mock 5",
    description: "mock 5",
    timestamp: 1707184711,
    tag: "test",
    mdFileUrl: "",
    coverUrl: "https://placeholder.com/300x200",
  },
  {
    id: 6,
    title: "mock 6",
    description: "mock 6",
    timestamp: 1707184711,
    tag: "test",
    mdFileUrl: "",
    coverUrl: "https://placeholder.com/300x200",
  },
  {
    id: 7,
    title: "mock 7",
    description: "mock 7",
    timestamp: 1707184711,
    tag: "test",
    mdFileUrl: "",
    coverUrl: "https://placeholder.com/300x200",
  },
];

export default async function Page({
  searchParams,
}: {
  searchParams: { size?: string };
}) {
  const posts = mocks.slice(0, Number(searchParams.size) || 1);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
          <Loader2 className="mr-2 animate-spin" />
          加载中...
        </div>
      }
    >
      <StreamLoader posts={posts} />
    </Suspense>
  );
}

const StreamLoader: React.FC<{
  posts: Post[];
}> = async ({ posts }) => {
  await sleep(1000);

  return (
    <div className="py-10">
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
