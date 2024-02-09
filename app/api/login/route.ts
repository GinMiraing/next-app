import { MD5, SHA256 } from "crypto-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { BadRequest } from "@/lib/error.server";
import Prisma from "@/lib/prisma";
import RedisClient from "@/lib/redis";
import { LoginSchema, LoginSchemaType } from "@/lib/schema";

export async function POST(req: Request) {
  const data: LoginSchemaType = await req.json();

  try {
    LoginSchema.parse(data);
  } catch (e) {
    return BadRequest("Incorrect email or password");
  }

  const admin = await Prisma.admin.findFirst({
    where: {
      email: data.email,
    },
  });

  if (!admin) {
    return BadRequest("Incorrect email or password");
  }

  const encodedPassword = SHA256(
    SHA256(data.email + data.password).toString() + admin.salt,
  ).toString();

  if (encodedPassword !== admin.password) {
    return BadRequest("Incorrect email or password");
  }

  const session = SHA256(data.password + admin.salt).toString();

  await RedisClient.set(
    `admin:${session}`,
    JSON.stringify({
      id: admin.id,
      name: admin.name,
      email_md5: admin.email_md5,
      avatar: admin.avatar_url,
    }),
    "NX",
  );

  cookies().set("SESSION", session, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    priority: "high",
  });

  return NextResponse.json({
    data: {
      message: "login success",
    },
  });
}
