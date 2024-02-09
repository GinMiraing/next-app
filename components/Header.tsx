"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useMediaQuery } from "@/lib/hooks";
import { useToast } from "@/lib/hooks/Toast/hook";
import { LoginSchema, LoginSchemaType } from "@/lib/schema";
import { BaseSetting } from "@/lib/settings";
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

const Header: React.FC<{
  items: {
    name: string;
    link: string;
  }[];
  isLogin: boolean;
  userData?: {
    id: number;
    name: string;
    email_md5: string;
    avatar: string;
  };
}> = ({ items, isLogin, userData }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile } = useMediaQuery();
  const { toast } = useToast();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      setLoading(true);
      await axios.post("/api/login", data);
      router.refresh();
    } catch (e) {
      toast({
        variant: "destructive",
        duration: 1000,
        title: "登录失败",
        description: formatError(e),
      });
    } finally {
      setLoading(false);
    }
  };

  const loginOut = async () => {
    try {
      setLoading(true);
      await axios.post("/api/logout");
      router.refresh();
    } catch (e) {
      toast({
        variant: "destructive",
        duration: 1000,
        title: "注销失败",
        description: formatError(e),
      });
    } finally {
      setLoading(false);
    }
  };

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
        <Avatar
          onClick={() => setOpen(true)}
          className="h-10 w-10 hover:cursor-pointer"
        >
          <AvatarImage
            src={BaseSetting.avatar}
            alt={BaseSetting.avatar}
          />
          <AvatarFallback>胤</AvatarFallback>
        </Avatar>
      </header>
      {isMobile ? (
        <Drawer
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            form.reset();
          }}
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{isLogin ? "用户信息" : "登录"}</DrawerTitle>
            </DrawerHeader>
            {isLogin ? (
              <>
                <div className="space-y-4 px-4 py-6">
                  <div className="font-medium">欢迎回来： {userData?.name}</div>
                </div>
                <DrawerFooter>
                  <Button
                    type="button"
                    onClick={() => {
                      loginOut();
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "注销"
                    )}
                  </Button>
                </DrawerFooter>
              </>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="w-full space-y-4 px-4 py-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">邮箱</FormLabel>
                          <FormControl>
                            <Input
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.email?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">密码</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.password?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                  <DrawerFooter>
                    <Button
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "登录"
                      )}
                    </Button>
                  </DrawerFooter>
                </form>
              </Form>
            )}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            form.reset();
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isLogin ? "用户信息" : "登录"}</DialogTitle>
            </DialogHeader>
            {isLogin ? (
              <>
                <div className="space-y-4  py-6">
                  <div className="font-medium">欢迎回来： {userData?.name}</div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={() => {
                      loginOut();
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "注销"
                    )}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="w-full space-y-4 py-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">邮箱</FormLabel>
                          <FormControl>
                            <Input
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.email?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">密码</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.password?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "登录"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Header;
