"use client";

import { cn } from "@/lib/utils";
import { format, isSameDay, startOfWeek } from "date-fns";
import { ko } from "date-fns/locale";

type WeekCalenarProps = {
  date: Date;
  setDate: (date: Date) => void;
  fromDate?: Date;
  endDate?: Date;
};

export default function WeekCalendar({
  date,
  setDate,
  fromDate,
  endDate,
}: WeekCalenarProps) {
  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const start = fromDate
      ? new Date(fromDate)
      : startOfWeek(date || new Date());
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });


  function handleDayClick(day: Date) {
    setDate(day);
  }

  return (
    <div className="flex justify-around gap-1">
      {weekDays.map((day, index) => (
        <button
          key={day.toISOString()}
          type="button"
          className={cn(
            "flex flex-col gap-1 items-center text-center w-full py-2 rounded-lg max-w-13 select-none cursor-pointer",
            (index === 0 || index === 6) && "text-orange-500",
            isSameDay(day, date) &&
              "bg-slate-800 text-white font-semibold",
            isSameDay(day, new Date()) &&
              !isSameDay(day, date) &&
              "bg-orange-100/50",
          )}
          onClick={() => handleDayClick(day)}
        >
          <span className="font-semibold text-sm">{format(day, "dd")}</span>
          <span className="opacity-50 text-xs">
            {format(day, "EEE", { locale: ko })}
          </span>
        </button>
      ))}
    </div>
  );
}
