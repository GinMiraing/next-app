import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

import { Button } from "../UI/Button";
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
      content: "",
    },
    mode: "onSubmit",
  });
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (value: CommentCreateType) => {
    try {
      setLoading(true);
      const { data } = await axios.get<{ data: string }>("/api/signature");
      const formData: CommentServerType = isReply
        ? {
            is_reply: true,
            comment_id: payload?.commentId || -1,
            reply_id: payload?.replyId === 0 ? 0 : payload?.replyId || -1,
            reply_name: payload?.replyName || "",
            content: value.content,
            signature: data.data,
          }
        : {
            is_reply: false,
            is_post: isPost,
            attach_id: payload?.attachId || -1,
            content: value.content,
            signature: data.data,
          };

      await axios.post("/api/comment", formData);
      router.refresh();
      setOpen(false);
      form.reset();
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

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) form.reset();
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>发表{isReply ? "回复" : "评论"}</DrawerTitle>
            <DrawerDescription>请填写信息，完成后点击“提交”</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ScrollArea className="h-[50vh] w-full p-4">
                {isReply && (
                  <div className="space-y-4 px-1 pb-4">
                    <div className="space-y-2">
                      <div className="inline-block bg-red-100 px-1">
                        @{payload.replyName}
                      </div>
                      <p className="whitespace-pre-wrap break-all text-justify text-sm/7 sm:text-base/8">
                        {payload.replyContent}
                      </p>
                    </div>
                    <hr />
                  </div>
                )}
                <FormFields form={form} />
              </ScrollArea>
              <DrawerFooter>
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>发表{isReply ? "回复" : "评论"}</DialogTitle>
          <DialogDescription>请填写信息，完成后点击“提交”</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="my-4 h-[50vh] w-full">
              {isReply && (
                <div className="space-y-4 px-1 pb-4">
                  <div className="space-y-2">
                    <div className="inline-block bg-red-100 px-1">
                      @{payload.replyName}
                    </div>
                    <p className="whitespace-pre-wrap break-all text-justify text-sm/7 sm:text-base/8">
                      {payload.replyContent}
                    </p>
                  </div>
                  <hr />
                </div>
              )}
              <FormFields form={form} />
            </ScrollArea>
            <DialogFooter>
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
    <div className="w-full space-y-4 px-1">
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
