"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "./UI/Avatar";

const MenuItems: {
  name: string;
  link: string;
}[] = [
  {
    name: "文章",
    link: "/posts",
  },
  {
    name: "动态",
    link: "/moments",
  },
  {
    name: "关于",
    link: "/about",
  },
];

const Header: React.FC = () => {
  return (
    <header className="fixed left-0 right-0 top-0 flex h-20 items-center justify-between border-b bg-background px-6 shadow">
      <Link
        className="font-medium text-xl transition-colors hover:text-foreground"
        href="/posts"
      >
        胤·居
      </Link>
      <nav className="hidden items-center space-x-8 sm:flex">
        {MenuItems.map((item) => (
          <Link
            key={item.name}
            className="text-lg transition-colors hover:text-foreground"
            href={item.link}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <Avatar className="h-10 w-10">
        <AvatarImage src="/avatar.png" />
        <AvatarFallback>胤</AvatarFallback>
      </Avatar>
    </header>
  );
};

export default Header;
