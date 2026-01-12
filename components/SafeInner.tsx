import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export default function SafeInner({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("px-3 lg:px-5", className)}>{children}</div>;
}
