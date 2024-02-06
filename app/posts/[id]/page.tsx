import axios from "axios";
import { CalendarDays, Tag } from "lucide-react";
import rehypeSanitize from "rehype-sanitize";
import rehypeShiki from "rehype-shiki";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkUnwrapImages from "remark-unwrap-images";
import { unified } from "unified";

import Markdown from "../components/Markdown";

export default async function Page({ params }: { params: { id: string } }) {
  const text = await axios.get("https://cdn.zengjunyin.com/posts/23.mdx", {
    headers: {
      "Content-Type": "text/markdown",
    },
  });

  const file = await unified()
    .use(remarkParse)
    .use(remarkUnwrapImages)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .use(rehypeShiki, {
      theme: "monokai",
    })
    .process(text.data);

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
      <Markdown text={file.value.toString()} />
    </div>
  );
}
