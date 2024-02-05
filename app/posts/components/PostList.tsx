"use client";

import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string;
};

const mocks = [
  {
    id: 1,
    title: "mock title 1",
    content: "mock content 1",
  },
  {
    id: 2,
    title: "mock title 2",
    content: "mock content 2",
  },
  {
    id: 3,
    title: "mock title 3",
    content: "mock content 3",
  },
];

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts((prev) => [...prev, mocks[0]]);
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
      <button onClick={() => setPosts((prev) => [...prev, mocks[1]])}>
        load
      </button>
      <button onClick={() => setPosts((prev) => [...prev, mocks[2]])}>
        load
      </button>
    </div>
  );
};

export default PostList;
