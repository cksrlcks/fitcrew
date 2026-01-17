"use client";

import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import SafeInner from "./SafeInner";
import { cn } from "@/lib/utils";
import { Layers, Syringe } from "lucide-react";
import { useLogContext } from "./provider/LogProvider";

export default function Quick() {
  const { onOpen } = useLogContext();

  return (
    <SafeInner className="flex gap-1">
      <QuickButton type="button" onClick={() => onOpen(true, "weight")}>
        <span className="flex w-10 h-10 rounded-full bg-rose-100 text-rose-700 items-center justify-center">
          <Layers size={20} className="opacity-40" />
        </span>
        <div className="space-y-0.5">
          <div className="text-xl font-semibold">
            86.4
            <span className="text-sm font-normal text-gray-500 pl-1">kg</span>
          </div>
          <div className="text-[13px] font-normal text-gray-500 tracking-tight">
            +0.5kg
          </div>
        </div>
      </QuickButton>
      <QuickButton type="button" onClick={() => onOpen(true, "injection")}>
        <span className="flex w-10 h-10 rounded-full bg-blue-100 text-blue-700 items-center justify-center">
          <Syringe size={20} className="opacity-40" />
        </span>
        <div className="space-y-0.5">
          <div className="text-xl font-semibold">
            2.5
            <span className="text-sm font-normal text-gray-500 pl-1">mg</span>
          </div>
          <div className="text-[13px] font-medium text-muted-foreground tracking-tight">
            최근 : 2026.01.17
          </div>
        </div>
      </QuickButton>
    </SafeInner>
  );
}

function QuickButton({
  className,
  children,
  ...rest
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={cn(
        "w-full rounded-[15px] cursor-pointer bg-slate-100 p-1",
        className
      )}
      {...rest}
    >
      <div className="rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.02)] flex flex-col gap-3 p-5 text-left bg-white">
        {children}
      </div>
    </button>
  );
}
