"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";

import { useMediaQuery } from "@/lib/hooks";
import { useToast } from "@/lib/hooks/Toast/hook";
import { UserCreateSchema, UserCreateType } from "@/lib/schema";
import type { UserProfile } from "@/lib/type";
import { formatError } from "@/lib/utils";

import { Button } from "../UI/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../UI/DIalog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../UI/Drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../UI/Form";
import { Input } from "../UI/Input";
import { ScrollArea } from "../UI/ScrollArea";

export const UserProfileDialog: React.FC<{
  data: UserProfile;
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ data, open, setOpen }) => {
  const { isMobile } = useMediaQuery();
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const logOut = async () => {
    try {
      setLoading(true);
      await axios.delete("/api/user");
      setOpen(false);
      router.refresh();
    } catch (e) {
      toast({
        variant: "destructive",
        duration: 1000,
        title: "清空模板失败",
        description: formatError(e),
      });
    } finally {
      setLoading(false);
    }
  };

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={setOpen}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>欢迎回来：{data.name}</DrawerTitle>
          </DrawerHeader>
          <div className="w-full space-y-8 px-4 py-4">
            <div className="flex flex-col space-y-2">
              <span className="font-medium">邮箱 MD5</span>
              <span>{data.emailMdD5}</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-medium">网站</span>
              <span>{data.siteUrl || "未填写"}</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-medium">评论总数</span>
              <span>{data.commentCount}</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-medium">回复总数</span>
              <span>{data.replyCount}</span>
            </div>
          </div>
          <DrawerFooter>
            <Button
              disabled={loading}
              onClick={() => logOut()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "清空模板"
              )}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>欢迎回来：{data.name}</DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-8 py-4">
          <div className="flex flex-col space-y-2">
            <span className="font-medium">邮箱 MD5</span>
            <span>{data.emailMdD5}</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-medium">网站</span>
            <span>{data.siteUrl || "未填写"}</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-medium">评论总数</span>
            <span>{data.commentCount}</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-medium">回复总数</span>
            <span>{data.replyCount}</span>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={loading}
            onClick={() => logOut()}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "清空模板"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const UserForm: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  const router = useRouter();
  const { isMobile } = useMediaQuery();
  const { toast } = useToast();
  const form = useForm<UserCreateType>({
    resolver: zodResolver(UserCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      site_url: "",
    },
    mode: "onSubmit",
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (value: UserCreateType) => {
    try {
      setLoading(true);
      const { data } = await axios.get<{
        data: string;
      }>("/api/signature");
      await axios.post("/api/user", {
        ...value,
        signature: data.data,
      });
      setOpen(false);
      router.refresh();
    } catch (e) {
      toast({
        variant: "destructive",
        duration: 1000,
        title: "提交失败",
        description: formatError(e),
      });
    } finally {
      setLoading(false);
    }
  };

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          form.reset();
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>填写评论模板</DrawerTitle>
            <DrawerDescription>此模板中的邮箱仅用于邮件通知</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ScrollArea className="h-[50vh] w-full p-4">
                <FormFields form={form} />
              </ScrollArea>
              <DrawerFooter>
                <Button
                  disabled={loading}
                  type="submit"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "提交"
                  )}
                </Button>
              </DrawerFooter>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        form.reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>填写评论模板</DialogTitle>
          <DialogDescription>此模板中的邮箱仅用于邮件通知</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="my-4 h-[50vh] w-full">
              <FormFields form={form} />
            </ScrollArea>
            <DialogFooter>
              <Button
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "提交"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const FormFields: React.FC<{
  form: UseFormReturn<UserCreateType>;
}> = ({ form }) => {
  return (
    <div className="w-full space-y-4 px-1">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">
              昵称 <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.name?.message}</FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">
              邮箱 <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.email?.message}</FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="site_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">网站</FormLabel>
            <FormControl>
              <Input
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.site_url?.message}</FormMessage>
          </FormItem>
        )}
      />
    </div>
  );
};
