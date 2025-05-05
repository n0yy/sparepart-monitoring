"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface TabsProps {
  tabs: string[];
  basePath: string;
  labelPrefix?: string;
}

export default function Tabs({ tabs, basePath, labelPrefix = "" }: TabsProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("machine") || "1";
  const createQueryString = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("machine", tab);
      return params;
    },
    [searchParams]
  );

  return (
    <div role="tablist" className="tabs my-2">
      {tabs.map((tab) => (
        <Link
          key={tab}
          href={`${basePath}?${createQueryString(tab)}`}
          className={`tab ${
            activeTab === tab
              ? "tab-active bg-primary text-white rounded-box"
              : ""
          }`}
          role="tab"
        >
          {labelPrefix ? `${labelPrefix} ${tab}` : tab}
        </Link>
      ))}
    </div>
  );
}
