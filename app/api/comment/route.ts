import { MD5 } from "crypto-js";
import { NextResponse } from "next/server";

import { BadRequest } from "@/lib/error.server";
import Prisma from "@/lib/prisma";
import RedisClient from "@/lib/redis";
import { CommentServerSchema, CommentServerType } from "@/lib/schema/comment";

export async function POST(req: Request) {
  const data: CommentServerType = await req.json();

  try {
    CommentServerSchema.parse(data);
  } catch (e) {
    return BadRequest("incorrect payload");
  }

  const signature = await RedisClient.get(`signature:${data.signature}`);

  if (!signature) {
    return BadRequest("incorrect signature");
  }

  const emailMD5 = MD5(data.user_email).toString();

  if (data.is_reply) {
    const result = await Prisma.reply.create({
      data: {
        comment_id: data.comment_id,
        reply_id: data.reply_id,
        reply_name: data.reply_name,
        user_name: data.user_name,
        user_email_md5: emailMD5,
        user_site_url: data.user_site_url,
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
        user_name: data.user_name,
        user_email_md5: emailMD5,
        user_site_url: data.user_site_url,
        content: data.content,
      },
    });

    await RedisClient.del(`signature:${data.signature}`);

    return NextResponse.json({
      data: result,
    });
  }
}
