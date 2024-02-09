"use client";

import { usePathname, useRouter } from "next/navigation";

const LoadMore: React.FC<{
  currentSize: number;
}> = ({ currentSize }) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <button
      onClick={() =>
        router.push(`${pathname}?size=${currentSize + 1}`, {
          scroll: false,
        })
      }
      className="flex items-center justify-center"
    >
      查看更多
    </button>
  );
};

export default LoadMore;
