import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";

import { useMediaQuery } from "@/lib/hooks";
import { useToast } from "@/lib/hooks/Toast/hook";
import {
  CommentCreateSchema,
  CommentCreateType,
  CommentPayload,
  CommentServerType,
} from "@/lib/schema/comment";
import { formatError } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../UI/Avatar";
import { Button } from "../UI/Button";
import { Checkbox } from "../UI/Checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "../UI/Textarea";

const CommentForm: React.FC<{
  open: boolean;
  isPost: boolean;
  isReply: boolean;
  payload: CommentPayload;
  setOpen: (open: boolean) => void;
}> = ({ open, isPost, isReply, payload, setOpen }) => {
  const { isMobile } = useMediaQuery();
  const form = useForm<CommentCreateType>({
    resolver: zodResolver(CommentCreateSchema),
    defaultValues: {
      user_name: "",
      user_email: "",
      user_site_url: "",
      content: "",
    },
    mode: "onSubmit",
  });
  const router = useRouter();
  const { toast } = useToast();

  const [autoFill, setAutoFill] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (value: CommentCreateType) => {
    if (autoFill) {
      window.localStorage.setItem(
        "user_data",
        JSON.stringify({
          name: value.user_name,
          email: value.user_email,
          site_url: value.user_site_url,
        }),
      );
    }

    try {
      setLoading(true);
      const { data } = await axios.get<{ data: string }>("/api/signature");
      const formData: CommentServerType = isReply
        ? {
            is_reply: true,
            comment_id: payload?.commentId || -1,
            reply_id: payload?.replyId === 0 ? 0 : payload?.replyId || -1,
            reply_name: payload?.replyName || "",
            user_name: value.user_name,
            user_email: value.user_email,
            user_site_url: value.user_site_url,
            content: value.content,
            signature: data.data,
          }
        : {
            is_reply: false,
            is_post: isPost,
            attach_id: payload?.attachId || -1,
            user_name: value.user_name,
            user_email: value.user_email,
            user_site_url: value.user_site_url,
            content: value.content,
            signature: data.data,
          };

      console.log(formData);

      const result = await axios.post("/api/comment", formData);
      router.refresh();
      setOpen(false);
    } catch (e) {
      toast({
        variant: "destructive",
        duration: 1000,
        title: "评论失败",
        description: formatError(e),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const autoFillData = window.localStorage.getItem("user_data");

    if (autoFillData) {
      try {
        const data: {
          name: string;
          email: string;
          site_url: string;
        } = JSON.parse(autoFillData);

        form.setValue("user_name", data.name);
        form.setValue("user_email", data.email);
        form.setValue("user_site_url", data.site_url);
        setAutoFill(true);
      } catch (e) {}
    }
  }, [isPost, isReply, payload]);

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) form.reset();
        }}
      >
        <DrawerContent className="bg-white px-4">
          <DrawerHeader>
            <DrawerTitle>发表{isReply ? "回复" : "评论"}</DrawerTitle>
            <DrawerDescription>请填写信息，完成后点击“提交”</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ScrollArea className="h-[50vh] w-full">
                {isReply && (
                  <div className="space-y-4 px-1 pb-4">
                    <div>你正在回复：</div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-8 w-8 rounded-md border">
                          <AvatarImage
                            src={`https://cravatar.cn/avatar/${payload.replyEmailMD5}`}
                            alt={payload.replyEmailMD5}
                          />
                          <AvatarFallback>{payload.replyName}</AvatarFallback>
                        </Avatar>
                        <div className="text-lg">{payload.replyName}</div>
                      </div>
                      <div>{payload.replyContent}</div>
                    </div>
                    <hr />
                  </div>
                )}
                <FormFields form={form} />
              </ScrollArea>
              <DrawerFooter className="mt-6 flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={autoFill}
                    onCheckedChange={(checked) => setAutoFill(Boolean(checked))}
                  />
                  <span className="text-sm">保存信息并自动填写</span>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
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
        if (!open) form.reset();
      }}
    >
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>发表{isReply ? "回复" : "评论"}</DialogTitle>
          <DialogDescription>请填写信息，完成后点击“提交”</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="no-scrollbar h-[50vh] w-full">
              <FormFields form={form} />
            </ScrollArea>
            <DialogFooter className="mt-6 flex w-full items-center space-x-4 sm:justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={autoFill}
                  onCheckedChange={(checked) => setAutoFill(Boolean(checked))}
                />
                <span className="text-sm">保存信息并自动填写</span>
              </div>
              <Button
                type="submit"
                disabled={loading}
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
  form: UseFormReturn<CommentCreateType>;
}> = ({ form }) => {
  return (
    <div className="w-full space-y-4 px-1 py-2">
      <FormField
        control={form.control}
        name="user_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">昵称</FormLabel>
            <FormControl>
              <Input
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage>
              {form.formState.errors.user_name?.message}
            </FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="user_email"
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
              {form.formState.errors.user_email?.message}
            </FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="user_site_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">网站</FormLabel>
            <FormControl>
              <Input
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage>
              {form.formState.errors.user_site_url?.message}
            </FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">内容</FormLabel>
            <FormControl>
              <Textarea
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.content?.message}</FormMessage>
          </FormItem>
        )}
      />
    </div>
  );
};

export default CommentForm;
