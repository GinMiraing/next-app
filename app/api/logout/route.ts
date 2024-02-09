import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  cookies().delete("SESSION");

  return NextResponse.json({
    data: {
      message: "logout success",
    },
  });
}
