import { MD5 } from "crypto-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { BadRequest } from "@/lib/error.server";
import Prisma from "@/lib/prisma";
import RedisClient from "@/lib/redis";
import { UserServerSchema, UserServerType } from "@/lib/schema";

export async function POST(req: Request) {
  const data: UserServerType = await req.json();

  try {
    UserServerSchema.parse(data);
  } catch (e) {
    return BadRequest();
  }

  const signature = await RedisClient.get(`signature:${data.signature}`);

  if (!signature) {
    return BadRequest("签名错误");
  }

  const existUser = await Prisma.user.findFirst({
    select: {
      email_md5: true,
    },
    where: {
      email_md5: MD5(data.email).toString(),
    },
  });

  if (existUser) {
    cookies().set("USER_SESSION", existUser.email_md5, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      priority: "high",
    });
    return NextResponse.json({
      data: "success",
    });
  }

  const user = await Prisma.user.create({
    select: {
      email_md5: true,
    },
    data: {
      name: data.name,
      email: data.email,
      email_md5: MD5(data.email).toString(),
      site_url: data.site_url,
    },
  });

  cookies().set("USER_SESSION", user.email_md5, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    priority: "high",
  });

  return NextResponse.json({
    data: "success",
  });
}

export async function DELETE(req: Request) {
  cookies().delete("USER_SESSION");

  return NextResponse.json({
    data: "success",
  });
}
