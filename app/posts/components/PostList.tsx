"use client";

import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn, sleep } from "@/lib/utils";

import PostCard from "./PostCard";

const mocks = [
  {
    id: 1,
    title: "生日快乐",
    description:
      "在我小的时候，每年最期盼的日子有三天：第一天是儿童节，因为学校会发好吃的，还不用上课；第二天是大年初二，因为走亲戚可以拿红包；第三天是我的生日，因为每次这时我都能拿到家人送的礼物，能吃上大蛋糕。大概从初中开始，礼物少了，蛋糕也换成了汉堡炸鸡",
    date: "2023-10-08",
    coverImage:
      "https://cdn.zengjunyin.com/images/105f4b2b35e636044921d7e29d76c690a4566ced.jpg",
    link: "/",
    tag: "生日",
  },
  {
    id: 2,
    title: "《敦刻尔克》：归家",
    description:
      "这两天和慧一起二刷了《敦刻尔克》这部电影，看完之后不禁思考一个问题：这部电影想要表现出怎样的战争观？诺兰拍过很多出名的电影，例如《盗梦空间》、《正义联盟》、《星际穿越》等。在这些电影中，我能感受到明显的叙事掌控感，主角团成员似乎都是明白“应该做什么”的人",
    date: "2022-12-12",
    coverImage:
      "https://cdn.zengjunyin.com/images/192cbac734b84878f3f3d914309c054ed77783f1.png",
    link: "/",
    tag: "电影",
  },
  {
    id: 3,
    title: "让人无语的微信安全机制",
    description:
      "我的手机是 19 年买的红米 K20 Pro，之前一直在用 MIUI 12.5 系统，也刷了魔改的内核。最初非常流畅，但最近越来越卡了，可能是 LSPosed 模块装太多的原因，正好在论坛看到了适合 K20 Pro 的 MIUI 13 刷机包，于是用一下午把手机系统升级了",
    date: "2023-02-07",
    coverImage:
      "https://cdn.zengjunyin.com/images/45fef9e56c5a8be5cb92e39a0d26e73c665a132a.png",
    link: "/",
    tag: "杂谈",
  },
  {
    id: 4,
    title: "生日快乐",
    description:
      "在我小的时候，每年最期盼的日子有三天：第一天是儿童节，因为学校会发好吃的，还不用上课；第二天是大年初二，因为走亲戚可以拿红包；第三天是我的生日，因为每次这时我都能拿到家人送的礼物，能吃上大蛋糕。大概从初中开始，礼物少了，蛋糕也换成了汉堡炸鸡",
    date: "2023-10-08",
    coverImage:
      "https://cdn.zengjunyin.com/images/105f4b2b35e636044921d7e29d76c690a4566ced.jpg",
    link: "/",
    tag: "生日",
  },
  {
    id: 5,
    title: "《敦刻尔克》：归家",
    description:
      "这两天和慧一起二刷了《敦刻尔克》这部电影，看完之后不禁思考一个问题：这部电影想要表现出怎样的战争观？诺兰拍过很多出名的电影，例如《盗梦空间》、《正义联盟》、《星际穿越》等。在这些电影中，我能感受到明显的叙事掌控感，主角团成员似乎都是明白“应该做什么”的人",
    date: "2022-12-12",
    coverImage:
      "https://cdn.zengjunyin.com/images/192cbac734b84878f3f3d914309c054ed77783f1.png",
    link: "/",
    tag: "电影",
  },
  {
    id: 6,
    title: "让人无语的微信安全机制",
    description:
      "我的手机是 19 年买的红米 K20 Pro，之前一直在用 MIUI 12.5 系统，也刷了魔改的内核。最初非常流畅，但最近越来越卡了，可能是 LSPosed 模块装太多的原因，正好在论坛看到了适合 K20 Pro 的 MIUI 13 刷机包，于是用一下午把手机系统升级了",
    date: "2023-02-07",
    coverImage:
      "https://cdn.zengjunyin.com/images/45fef9e56c5a8be5cb92e39a0d26e73c665a132a.png",
    link: "/",
    tag: "杂谈",
  },
  {
    id: 7,
    title: "生日快乐",
    description:
      "在我小的时候，每年最期盼的日子有三天：第一天是儿童节，因为学校会发好吃的，还不用上课；第二天是大年初二，因为走亲戚可以拿红包；第三天是我的生日，因为每次这时我都能拿到家人送的礼物，能吃上大蛋糕。大概从初中开始，礼物少了，蛋糕也换成了汉堡炸鸡",
    date: "2023-10-08",
    coverImage:
      "https://cdn.zengjunyin.com/images/105f4b2b35e636044921d7e29d76c690a4566ced.jpg",
    link: "/",
    tag: "生日",
  },
  {
    id: 8,
    title: "《敦刻尔克》：归家",
    description:
      "这两天和慧一起二刷了《敦刻尔克》这部电影，看完之后不禁思考一个问题：这部电影想要表现出怎样的战争观？诺兰拍过很多出名的电影，例如《盗梦空间》、《正义联盟》、《星际穿越》等。在这些电影中，我能感受到明显的叙事掌控感，主角团成员似乎都是明白“应该做什么”的人",
    date: "2022-12-12",
    coverImage:
      "https://cdn.zengjunyin.com/images/192cbac734b84878f3f3d914309c054ed77783f1.png",
    link: "/",
    tag: "电影",
  },
  {
    id: 9,
    title: "让人无语的微信安全机制",
    description:
      "我的手机是 19 年买的红米 K20 Pro，之前一直在用 MIUI 12.5 系统，也刷了魔改的内核。最初非常流畅，但最近越来越卡了，可能是 LSPosed 模块装太多的原因，正好在论坛看到了适合 K20 Pro 的 MIUI 13 刷机包，于是用一下午把手机系统升级了",
    date: "2023-02-07",
    coverImage:
      "https://cdn.zengjunyin.com/images/45fef9e56c5a8be5cb92e39a0d26e73c665a132a.png",
    link: "/",
    tag: "杂谈",
  },
];

const PostList: React.FC = () => {
  const currentSize = useRef(1);
  const totalSize = useRef(mocks.length);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<
    {
      id: number;
      title: string;
      description: string;
      date: string;
      coverImage: string;
      link: string;
      tag: string;
    }[]
  >([]);

  const fetchPosts = useCallback(async (size: number) => {
    try {
      setLoading(true);
      await sleep(2000);
      setPosts(mocks.slice(0, size));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(currentSize.current);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col space-y-8">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
          />
        ))}
        <div className="flex w-full items-center justify-center space-x-2">
          <span className="animate-spin">
            <Loader2 className="h-4 w-4" />
          </span>
          <span>loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          {...post}
        />
      ))}
      <button
        className={cn("w-full", {
          hidden: totalSize.current <= currentSize.current,
        })}
        onClick={() => {
          currentSize.current = currentSize.current + 1;
          fetchPosts(currentSize.current);
        }}
      >
        load
      </button>
    </div>
  );
};

export default PostList;
