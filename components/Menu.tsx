"use client";

import { Aperture, Pencil, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

const MenuItems: {
  name: string;
  link: string;
  icon: ReactNode;
}[] = [
  {
    name: "文章",
    link: "/posts",
    icon: <Pencil className="h-5 w-5" />,
  },
  {
    name: "动态",
    link: "/moments",
    icon: <Aperture className="h-5 w-5" />,
  },
  {
    name: "关于",
    link: "/about",
    icon: <UserRound className="h-5 w-5" />,
  },
];

const Menu: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 grid h-20 grid-cols-3 items-center border-t bg-background sm:hidden">
      {MenuItems.map((item) => (
        <Link
          key={item.name}
          className={cn(
            "flex w-full flex-col items-center justify-center space-y-2 text-lg transition-colors hover:text-foreground",
            {
              "pointer-events-none text-foreground": pathname.startsWith(
                item.link,
              ),
            },
          )}
          href={item.link}
        >
          <span>{item.icon}</span>
          <span className="text-sm">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Menu;
