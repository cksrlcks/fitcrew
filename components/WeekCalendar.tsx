"use client";

import { cn } from "@/lib/utils";
import { format, isSameDay, addWeeks, addDays, startOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { useRef } from "react";
import { useLogContext } from "./provider/LogProvider";
import { Skeleton } from "./ui/skeleton";

export function getWeekDates(baseDate: Date) {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

const SWIPE_THRESHOLD = 40;

export default function WeekCalendar() {
  const { date, setDate, data, displayDate, setDisplayDate, isLoading } = useLogContext();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);

  const isSwipingRef = useRef(false);
  const lockedRef = useRef(false);

  const weekDates = getWeekDates(displayDate || new Date());

  return (
    <div
      ref={containerRef}
      className="w-full select-none"
      style={{ touchAction: "pan-y" }}
      onPointerDown={(e) => {
        startXRef.current = e.clientX;
        startYRef.current = e.clientY;
        isSwipingRef.current = false;
      }}
      onPointerMove={(e) => {
        if (
          startXRef.current == null ||
          startYRef.current == null ||
          isSwipingRef.current
        )
          return;

        const dx = e.clientX - startXRef.current;
        const dy = e.clientY - startYRef.current;

        if (Math.abs(dx) < Math.abs(dy)) return;

        if (Math.abs(dx) >= SWIPE_THRESHOLD) {
          isSwipingRef.current = true;

          containerRef.current?.setPointerCapture(e.pointerId);
        }
      }}
      onPointerUp={(e) => {
        if (containerRef.current?.hasPointerCapture(e.pointerId)) {
          containerRef.current.releasePointerCapture(e.pointerId);
        }

        if (
          lockedRef.current ||
          !isSwipingRef.current ||
          startXRef.current == null
        ) {
          startXRef.current = null;
          startYRef.current = null;
          isSwipingRef.current = false;
          return;
        }

        const dx = e.clientX - startXRef.current;

        lockedRef.current = true;

        if (dx < 0) {
          setDisplayDate((d) => addWeeks(d, 1));
        } else {
          setDisplayDate((d) => addWeeks(d, -1));
        }

        startXRef.current = null;
        startYRef.current = null;
        isSwipingRef.current = false;

        setTimeout(() => {
          lockedRef.current = false;
        }, 120);
      }}
      onPointerCancel={() => {
        startXRef.current = null;
        startYRef.current = null;
        isSwipingRef.current = false;
        lockedRef.current = false;
      }}
    >
      <div className="flex justify-around gap-1">
        {weekDates.map((day, dayIndex) => {
          const key = format(day, "yyyy-MM-dd");

          return (
            <div key={key} className="flex flex-col items-center gap-1 flex-1">
              <button
                type="button"
                className={cn(
                  "flex flex-col gap-1 items-center w-full py-2 rounded-lg max-w-13",
                  (dayIndex === 5 || dayIndex === 6) && "text-orange-500",
                  isSameDay(day, date) &&
                    "bg-slate-800 text-white font-semibold",
                  isSameDay(day, new Date()) &&
                    !isSameDay(day, date) &&
                    "bg-orange-100/50",
                )}
                onClick={() => setDate(day)}
              >
                <span className="text-sm font-semibold">
                  {format(day, "dd")}
                </span>
                <span className="text-xs opacity-50">
                  {format(day, "EEE", { locale: ko })}
                </span>
              </button>

              {isLoading ? (
                <div
                  key={dayIndex}
                  className="flex flex-col gap-2 items-center text-center w-full py-2 max-w-13 select-none"
                >
                  <Skeleton className="w-full h-2" />
                  <Skeleton className="w-[50%] h-2" />
                </div>
              ) : (
                <div className="text-[11px] text-center font-semibold">
                  <div>{data?.[key]?.body?.weight ?? "-"}</div>
                  <div className="opacity-50">
                    {data?.[key]?.body?.bodyFatRate ?? "-"}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
