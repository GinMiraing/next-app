import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import { sleep } from "@/lib/utils";

import MomentCard from "./components/MomentCard";

export default async function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
          <Loader2 className="mr-2 animate-spin" />
          加载中...
        </div>
      }
    >
      <StreamLoader />
    </Suspense>
  );
}

const StreamLoader: React.FC = async () => {
  await sleep(1000);

  return (
    <div className="py-10">
      <div className="flex flex-col space-y-8">
        <MomentCard />
        <MomentCard />
        <MomentCard />
      </div>
    </div>
  );
};
