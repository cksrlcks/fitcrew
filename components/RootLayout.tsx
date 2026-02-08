"use client";

import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { isMobile } from "react-device-detect";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko" className={cn("dark", isMobile && "overflow-hidden")}>
      <body className={cn("antialiased", isMobile && "overflow-hidden")}>
        {children}
      </body>
    </html>
  );
}
