import "@fancyapps/ui/dist/fancybox/fancybox.css";
import axios from "axios";
import { CalendarDays, Loader2, Tag } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Suspense } from "react";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import remarkUnwrapImages from "remark-unwrap-images";

import CommentCard from "../components/CommentCard";

const components = {
  img: (props: any) => (
    <a
      href={props.src}
      data-fancybox
      className="block"
    >
      <img
        src={`${props.src}/post_thumb`}
        alt={props.alt}
      />
    </a>
  ),
};

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
          <Loader2 className="mr-2 animate-spin text-foreground" />
          加载中...
        </div>
      }
    >
      <StreamLoader id={params.id || "1"} />
    </Suspense>
  );
}

const StreamLoader: React.FC<{
  id: string;
}> = async ({ id }) => {
  const text = await axios.get(`https://cdn.zengjunyin.com/posts/${id}.mdx`, {
    headers: {
      "Content-Type": "text/markdown",
    },
  });

  return (
    <div className="space-y-8 py-10">
      <h1 className="text-center font-medium text-2xl">post title</h1>
      <div className="flex w-full items-center justify-center space-x-5 text-sm">
        <div className="flex items-center space-x-2">
          <span>
            <CalendarDays className="h-4 w-4" />
          </span>
          <span>2024-12-21</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>
            <Tag className="h-4 w-4" />
          </span>
          <span>tag</span>
        </div>
      </div>
      <div className="h-60 w-full overflow-hidden rounded-md sm:h-80">
        <img
          className="h-full w-full object-cover"
          src="https://placeholder.com/300x200"
          alt=""
        />
      </div>
      <div className="markdown space-y-6">
        <MDXRemote
          source={text.data}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkUnwrapImages],
              rehypePlugins: [rehypeHighlight],
            },
          }}
        />
      </div>
      <CommentCard />
    </div>
  );
};
