"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const LoadMore: React.FC<{ size: number }> = ({ size }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <button
      onClick={() =>
        router.push(`${pathname}?${createQueryString("size", `${size + 1}`)}`, {
          scroll: false,
        })
      }
    >
      load more
    </button>
  );
};

export default LoadMore;
