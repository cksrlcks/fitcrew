"use client";

import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import SafeInner from "./SafeInner";
import { cn } from "@/lib/utils";
import { Layers, Syringe } from "lucide-react";
import { useLogContext } from "./provider/LogProvider";
import { Skeleton } from "./ui/skeleton";
import Calendar from "./Calendar";

export default function Quick() {
  const { onOpen, isLoading, date, currentData, lastInjectionDate, setDate, setDisplayDate } =
    useLogContext();

  return (
    <div className="space-y-4">
      <SafeInner>
        <Calendar
          date={date}
          setDate={(newDate) => {
            setDisplayDate(newDate || new Date());
            setDate(newDate || new Date());
          }}
        />
      </SafeInner>
      <SafeInner className="flex gap-1">
        <QuickButton
          type="button"
          onClick={() => onOpen(true, "weight", date)}
          disabled={isLoading}
          >
            <span className="flex w-10 h-10 rounded-full bg-primary/10 text-primary items-center justify-center">
            <Layers size={20} />
          </span>
          <div className="space-y-0.5">
            <div className="text-xl font-semibold">
              {isLoading ? (
                <Skeleton className="h-4 mb-3" />
              ) : (
                <>
                  {currentData?.body?.weight ?? "-"}{" "}
                  <span className="text-sm font-normal text-gray-500 pl-1">
                    kg
                  </span>
                </>
              )}
            </div>
            <div className="text-[13px] font-normal text-gray-500 tracking-tight">
              체중 기록
            </div>
          </div>
        </QuickButton>
        <QuickButton
          type="button"
          onClick={() => onOpen(true, "injection", date)}
          disabled={isLoading}
        >
          <span className="flex w-10 h-10 rounded-full bg-yellow-500/10 text-yellow-500 items-center justify-center">
            <Syringe size={20} />
          </span>
          <div className="space-y-0.5">
            <div className="text-xl font-semibold">
              {isLoading ? (
                <Skeleton className="h-4 mb-3" />
              ) : (
                <>
                  {currentData?.injection?.dosage ?? "-"}{" "}
                  <span className="text-sm font-normal text-gray-500 pl-1">
                    mg
                  </span>
                </>
              )}
            </div>
            <div className="text-[13px] font-medium text-gray-500 tracking-tight">
              최근 : {lastInjectionDate || "-"}
            </div>
          </div>
        </QuickButton>
      </SafeInner>
    </div>
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
