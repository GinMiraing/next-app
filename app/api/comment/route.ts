import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { BadRequest, Forbidden } from "@/lib/error.server";
import Prisma from "@/lib/prisma";
import RedisClient from "@/lib/redis";
import { CommentServerSchema, CommentServerType } from "@/lib/schema/comment";

export async function POST(req: Request) {
  const data: CommentServerType = await req.json();

  try {
    CommentServerSchema.parse(data);
  } catch (e) {
    return BadRequest();
  }

  const signature = await RedisClient.get(`signature:${data.signature}`);

  if (!signature) {
    return BadRequest("签名错误");
  }

  const userSession = cookies().get("USER_SESSION");

  if (!userSession) {
    return Forbidden("未填写评论模板");
  }

  const user = await Prisma.user.findFirst({
    select: {
      name: true,
      email_md5: true,
      site_url: true,
      tag: true,
    },
    where: {
      email_md5: userSession.value,
      banned: false,
    },
  });

  if (!user) {
    return BadRequest("用户不存在");
  }

  if (data.is_reply) {
    const result = await Prisma.reply.create({
      data: {
        comment_id: data.comment_id,
        reply_id: data.reply_id,
        reply_name: data.reply_name,
        user_name: user.name,
        user_email_md5: user.email_md5,
        user_site_url: user.site_url,
        user_tag: user.tag,
        content: data.content,
      },
    });

    await RedisClient.del(`signature:${data.signature}`);

    return NextResponse.json({
      data: result,
    });
  } else {
    const result = await Prisma.comment.create({
      data: {
        is_post: data.is_post,
        attach_id: data.attach_id,
        user_name: user.name,
        user_email_md5: user.email_md5,
        user_site_url: user.site_url,
        user_tag: user.tag,
        content: data.content,
      },
    });

    await RedisClient.del(`signature:${data.signature}`);

    return NextResponse.json({
      data: result,
    });
  }
}
