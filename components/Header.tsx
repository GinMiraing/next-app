"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useMediaQuery } from "@/lib/hooks";
import { useToast } from "@/lib/hooks/Toast/hook";
import { LoginSchema, LoginSchemaType } from "@/lib/schema";
import { BaseSetting } from "@/lib/settings";
import { UserProfile } from "@/lib/type";
import { cn, formatError } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./UI/Avatar";
import { Button } from "./UI/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./UI/DIalog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./UI/Drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./UI/Form";
import { Input } from "./UI/Input";
import { useUser } from "./User/hook";

const FormSchema = z.discriminatedUnion("is_login", [
  z.object({
    is_login: z.literal(true),
    email: z.string().email(),
  }),
  z.object({
    is_login: z.literal(false),
    name: z.string().min(1),
    email: z.string().email(),
    site_url: z.union([z.string().length(0), z.string().url()]),
  }),
]);

type FormType = z.infer<typeof FormSchema>;

const Header: React.FC<{
  items: {
    name: string;
    link: string;
  }[];
  userData?: UserProfile;
  isLogin: boolean;
}> = ({ items, userData, isLogin }) => {
  const pathname = usePathname();
  const { setUserFormOpen, setUserProfileOpen } = useUser();

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-10 flex h-20 items-center justify-between border-b bg-background px-6 shadow">
        <Link
          className="font-medium text-xl transition-colors hover:text-foreground"
          href="/posts"
        >
          胤·居
        </Link>
        <nav className="hidden items-center space-x-8 sm:flex">
          {items.map((item) => (
            <Link
              key={item.name}
              className={cn("text-lg transition-colors hover:text-foreground", {
                "pointer-events-none text-foreground": pathname.startsWith(
                  item.link,
                ),
              })}
              href={item.link}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        {!isLogin ? (
          <Button onClick={() => setUserFormOpen(true)}>评论模板</Button>
        ) : (
          <Avatar
            onClick={() => setUserProfileOpen(true)}
            className="h-10 w-10 hover:cursor-pointer"
          >
            <AvatarImage
              src={`https://cravatar.cn/avatar/${userData?.emailMdD5}`}
              alt={userData?.emailMdD5}
            />
            <AvatarFallback>{userData?.name}</AvatarFallback>
          </Avatar>
        )}
      </header>
    </>
  );
};

export default Header;
