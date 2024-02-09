"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

const Menu: React.FC<{
  items: {
    name: string;
    link: string;
    icon: ReactNode;
  }[];
}> = ({ items }) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 grid h-20 items-center border-t bg-background sm:hidden",
        {
          "grid-cols-3": items.length === 3,
          "grid-cols-4": items.length === 4,
        },
      )}
    >
      {items.map((item) => (
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
