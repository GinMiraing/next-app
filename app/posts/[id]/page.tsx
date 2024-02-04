import axios from "axios";
import rehypeSanitize from "rehype-sanitize";
import rehypeShiki from "rehype-shiki";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkUnwrapImages from "remark-unwrap-images";
import { unified } from "unified";

import Markdown from "@/components/Markdown";

export default async function Page() {
  const text = await axios.get("https://cdn.zengjunyin.com/posts/24.mdx", {
    headers: {
      "Content-Type": "text/markdown",
    },
  });

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(remarkUnwrapImages)
    .use(rehypeStringify)
    .use(rehypeShiki, {
      theme: "monokai",
    })
    .process(text.data);

  console.log(file.value);

  return (
    <div>
      <Markdown text={file.value.toString()} />
    </div>
  );
}
