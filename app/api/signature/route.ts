import { SHA256 } from "crypto-js";
import { NextResponse } from "next/server";

import { Forbidden } from "@/lib/error.server";
import RedisClient from "@/lib/redis";

export async function GET(req: Request) {
  const throttle = await RedisClient.get("signature:throttle");

  if (throttle && Number(throttle) > 50) {
    return Forbidden("请求过于频繁");
  }

  const timestamp = Date.now();
  const nonce = Math.floor(Math.random() * 100000);

  const signature = SHA256(`${timestamp}${nonce}`).toString();

  await RedisClient.set(`signature:${signature}`, 1, "EX", 10, "NX");

  if (throttle) {
    await RedisClient.incr("signature:throttle");
  } else {
    await RedisClient.set("signature:throttle", 1, "EX", 120, "NX");
  }

  return NextResponse.json({
    data: signature,
  });
}
