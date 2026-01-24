"use client";

import WeekCalendar from "./WeekCalendar";
import SafeInner from "./SafeInner";
import Calendar from "./Calendar";
import { useLogContext } from "./provider/LogProvider";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WeekStatus() {
  const { date, setDate } = useLogContext();
  const handlePrevWeek = () => {
    const prevWeekDate = new Date(date);
    prevWeekDate.setDate(date.getDate() - 7);
    setDate(prevWeekDate);
  };

  const handleNextWeek = () => {
    const nextWeekDate = new Date(date);
    nextWeekDate.setDate(date.getDate() + 7);
    setDate(nextWeekDate);
  };

  return (
    <div className="space-y-4">
      <SafeInner className="border-b border-b-gray-100 flex items-center justify-between pb-4">
        <Calendar
          date={date}
          setDate={(newDate) => setDate(newDate || new Date())}
        />
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon-xs"
            variant="outline"
            onClick={handlePrevWeek}
          >
            <ChevronLeft size={10} />
          </Button>
          <Button
            type="button"
            size="icon-xs"
            variant="outline"
            onClick={handleNextWeek}
          >
            <ChevronRight size={10} />
          </Button>
        </div>
      </SafeInner>

      <div>
        <SafeInner>
          <WeekCalendar
          />
        </SafeInner>
        {/* <SafeInner>
          <div className="flex justify-around gap-1 h-12.5">
            {isLoading
              ? Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 items-center text-center w-full py-2 max-w-13 select-none"
                  >
                    <Skeleton className="w-full h-2" />
                    <Skeleton className="w-[50%] h-2" />
                  </div>
                ))
              : weekData?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-1/2 items-center text-center w-full py-2 max-w-13 select-none text-[11px] font-semibold"
                  >
                    <span className="">
                      {item.body?.weight ? `${item.body.weight}kg` : "-"}
                    </span>
                    <span className="opacity-50">
                      {item.body?.bodyFatRate
                        ? `${item.body.bodyFatRate}%`
                        : "-"}
                    </span>
                  </div>
                ))}
          </div>
        </SafeInner> */}
      </div>
    </div>
  );
}
