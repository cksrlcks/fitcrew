"use client";

import { useMobile } from "@/hook/useMobile";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  const isMobile = useMobile();

  return (
    <html lang="ko" className={cn("dark", isMobile && "overflow-hidden")}>
      <body className={cn("antialiased", isMobile && "overflow-hidden")}>
        {children}
      </body>
    </html>
  );
}
