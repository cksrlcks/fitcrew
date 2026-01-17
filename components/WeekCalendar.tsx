"use client";

import { cn } from "@/lib/utils";
import { format, isSameDay, startOfWeek } from "date-fns";
import { ko } from "date-fns/locale";

type WeekCalenarProps = {
  date: Date | undefined;
}

export default function WeekCalendar( { date }: WeekCalenarProps ) {
  const startOfWeekDate = startOfWeek(date ?? new Date());
  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(startOfWeekDate);
    date.setDate(startOfWeekDate.getDate() + index);
    return date;
  });

  return (
    <div className="flex justify-around gap-1">
      {weekDays.map((day, index) => (
        <div
          key={day.toISOString()}
          className={cn(
            "flex flex-col gap-1 items-center text-center w-full py-2 rounded-lg max-w-13 select-none",
            (index === 0 || index === 6) && "text-orange-500",
            isSameDay(day, new Date()) && "bg-slate-800 text-white font-semibold",
          )}
        >
          <span className="font-semibold text-sm">{format(day, "dd")}</span>
          <span className="opacity-50 text-xs">
            {format(day, "EEE", { locale: ko })}
          </span>
        </div>
      ))}
    </div>
  );
}
