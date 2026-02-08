"use client";

import { cn } from "@/lib/utils";
import {
  format,
  isSameDay,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  differenceInCalendarMonths,
  isSameMonth,
} from "date-fns";
import { ko } from "date-fns/locale";
import { useEffect, useRef } from "react";
import { useLogContext } from "./provider/LogProvider";
import { Skeleton } from "./ui/skeleton";

export default function MonthScrollCalendar() {
  const { date, setDate, data, displayDate, isLoading } = useLogContext();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevDateRef = useRef<Date | null>(null);

  const startDate = startOfMonth(displayDate);
  const endDate = endOfMonth(displayDate);
  const daysInMonthArray = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const prevDate = prevDateRef.current;
    prevDateRef.current = date;

    const today = new Date();
    let target: HTMLElement | null = null;

    if (!prevDate) {
      target = containerRef.current.querySelector(
        '[data-today="true"]',
      ) as HTMLElement | null;
    } else {
      const monthDiff = differenceInCalendarMonths(date, prevDate);
      const isTodaySelected = isSameDay(date, today);

      if (monthDiff === 0 && !isTodaySelected) {
        const key = format(date, "yyyy-MM-dd");
        target = containerRef.current.querySelector(
          `[data-date="${key}"]`,
        ) as HTMLElement | null;
      } else if (isTodaySelected && isSameMonth(today, displayDate)) {
        target = containerRef.current.querySelector(
          '[data-today="true"]',
        ) as HTMLElement | null;
      } else if (monthDiff < 0) {
        target = containerRef.current.querySelector(
          '[data-last="true"]',
        ) as HTMLElement | null;
      } else {
        target = containerRef.current.querySelector(
          '[data-first="true"]',
        ) as HTMLElement | null;
      }
    }

    if (!target) return;

    requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    });
  }, [date, displayDate]);

  return (
    <div className="relative">
      <span className="absolute left-0 top-0 h-[calc(100%-10px)] w-4 bg-linear-to-r from-background to-background/0 z-1"></span>

      <div
        className="flex gap-2 whitespace-nowrap overflow-x-auto px-4 lg:px-5 relative custom-scrollbar pb-4 select-none"
        ref={containerRef}
      >
        {daysInMonthArray.map((day) => {
          const dayIndex = day.getDay();
          const key = format(day, "yyyy-MM-dd");
          const isToday = isSameDay(day, new Date());
          const isFirst = day.getDate() === 1;
          const isLast = day.getDate() === endDate.getDate();

          return (
            <div key={format(day, "yyyy-MM-dd")}>
              <button
                type="button"
                className={cn(
                  "flex flex-col justify-center gap-2 items-center h-30 max-w-16 w-[30vw] rounded-full text-white cursor-pointer",
                  isSameDay(day, date) &&
                    "bg-primary/10 text-primary font-semibold",
                  isToday && !isSameDay(day, date) && "bg-card",
                )}
                data-first={isFirst ? "true" : undefined}
                data-last={isLast ? "true" : undefined}
                data-today={isToday ? "true" : undefined}
                data-date={format(day, "yyyy-MM-dd")}
                onClick={() => {
                  setDate(day);
                }}
              >
                <div
                  className={cn(
                    "flex flex-col items-center",
                    dayIndex === 6 && "text-blue-500",
                    dayIndex === 0 && "text-orange-500",
                    isSameDay(day, date) && "text-primary",
                  )}
                >
                  <span className="text-lg font-bold">{format(day, "dd")}</span>
                  <span className="text-xs opacity-50">
                    {format(day, "EEE", { locale: ko })}
                  </span>
                </div>

                {isLoading ? (
                  <div
                    key={dayIndex}
                    className="flex flex-col gap-2 items-center text-center w-full py-2 max-w-13 select-none"
                  >
                    <Skeleton
                      className={cn(
                        "w-full h-2",
                        isSameDay(day, date) && "bg-primary/50",
                      )}
                    />
                    <Skeleton
                      className={cn(
                        "w-[50%] h-2",
                        isSameDay(day, date) && "bg-primary/50",
                      )}
                    />
                  </div>
                ) : (
                  <div className="text-[12px] text-center font-semibold">
                    <div>{data?.[key]?.body?.weight ?? "-"}</div>
                    <div className="opacity-50">
                      {data?.[key]?.body?.bodyFatRate ?? "-"}
                    </div>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
      <span className="absolute right-0 top-0 h-[calc(100%-10px)] w-4 bg-linear-to-l from-background to-background/0 z-1"></span>
    </div>
  );
}
