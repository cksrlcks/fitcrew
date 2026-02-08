"use client";

import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko" className={cn("dark", "overflow-hidden")}>
      <body className={cn("antialiased", "overflow-hidden")}>{children}</body>
    </html>
  );
}
