import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import { getMoments } from "@/lib/prisma.server";

import LoadMore from "@/components/LoadMore";

import MomentCard from "./components/MomentCard";

export default async function Page({
  searchParams,
}: {
  searchParams: { size?: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
          <Loader2 className="mr-2 animate-spin text-foreground" />
          加载中...
        </div>
      }
    >
      <StreamLoader size={searchParams.size ? Number(searchParams.size) : 8} />
    </Suspense>
  );
}

const StreamLoader: React.FC<{
  size: number;
}> = async ({ size }) => {
  const { moments, total } = await getMoments(size);

  return (
    <div className="py-4 sm:py-10">
      <div className="flex flex-col space-y-4 sm:space-y-8">
        {moments.map((moment) => (
          <MomentCard
            key={moment.id}
            data={moment}
          />
        ))}
        {size < total && <LoadMore currentSize={size} />}
      </div>
    </div>
  );
};
