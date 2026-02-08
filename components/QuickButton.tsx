import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

export default function QuickButton({
  className,
  children,
  ...rest
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={cn(
        "w-full rounded-[15px] cursor-pointer bg-card p-1",
        className,
      )}
      {...rest}
    >
      <div className="rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.02)] flex flex-col gap-3 p-5 text-left bg-card">
        {children}
      </div>
    </button>
  );
}
