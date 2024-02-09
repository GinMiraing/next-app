import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import RedisClient from "@/lib/redis";

export async function Page() {
  const session = cookies().get("SESSION");

  if (!session) {
    return redirect("/posts");
  }

  const data = await RedisClient.get(session.value);

  if (!data) {
    return redirect("/posts");
  }

  const decodeData: {
    id: number;
    name: string;
    email_md5: string;
    avatar: string;
  } = JSON.parse(data);

  return <div>{session?.value}</div>;
}
