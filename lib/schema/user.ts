import { z } from "zod";

export const UserCreateSchema = z.object({
  name: z.string().min(1, "用户名不得为空"),
  email: z.string().email("请输入正确的邮箱地址"),
  site_url: z.union([z.string().length(0), z.string().url("请输入正确的网址")]),
});

export type UserCreateType = z.infer<typeof UserCreateSchema>;

export const UserServerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  site_url: z.union([z.string().length(0), z.string().url()]),
  signature: z.string().length(64),
});

export type UserServerType = z.infer<typeof UserServerSchema>;
