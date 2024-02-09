import { SHA256 } from "crypto-js";
import { NextResponse } from "next/server";

import RedisClient from "@/lib/redis";

export async function GET(req: Request) {
  const timestamp = Date.now();
  const nonce = Math.floor(Math.random() * 100000);

  const signature = SHA256(`${timestamp}${nonce}`).toString();

  await RedisClient.set(`signature:${signature}`, 1, "EX", 10, "NX");

  return NextResponse.json({
    data: signature,
  });
}
