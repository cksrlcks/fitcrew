"use client";

import { useMobile } from "@/hook/useMobile";
import { PropsWithChildren } from "react";

export default function MobileContainer({ children }: PropsWithChildren) {
  const isMobile = useMobile();

  if (!isMobile) {
    return <div className="w-full flex flex-col max-w-md mx-auto relative bg-background">{children}</div>;
  }

  return (
    <div className="h-dvh w-full flex flex-col max-w-md mx-auto relative bg-background overflow-y-auto overflow-x-hidden scrollbar-hide">
      {children}
    </div>
  );
}
