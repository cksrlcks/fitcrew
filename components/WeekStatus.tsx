"use client";

import WeekCalendar from "./WeekCalendar";
import SafeInner from "./SafeInner";
import Calendar from "./Calendar";
import { useLogContext } from "./provider/LogProvider";
import { Spinner } from "./ui/spinner";
import { Skeleton } from "./ui/skeleton";

export default function WeekStatus() {
  const { date, setDate, from, end, weekData, isLoading } = useLogContext();

  return (
    <div className="space-y-4">
      <SafeInner className="border-b border-b-gray-100 flex items-center justify-between pb-4">
        <Calendar
          date={date}
          setDate={(newDate) => setDate(newDate || new Date())}
        />
        {isLoading && <Spinner className="opacity-50"/>}
      </SafeInner>

      <div>
        <SafeInner>
          <WeekCalendar
            date={date}
            setDate={setDate}
            fromDate={from}
            endDate={end}
          />
        </SafeInner>
        <SafeInner>
          <div className="flex justify-around gap-1 h-12.5">
            {isLoading ? (
              Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 items-center text-center w-full py-2 max-w-13 select-none"
                >
                  <Skeleton className="w-full h-2" />
                  <Skeleton className="w-[50%] h-2" />
                </div>
              ))
            ) : (

              weekData?.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1/2 items-center text-center w-full py-2 max-w-13 select-none text-[11px] font-semibold"
                >
                  <span className="">
                    {item.body?.weight ? `${item.body.weight}kg` : "-"}
                  </span>
                  <span className="opacity-50">
                    {item.body?.bodyFatRate ? `${item.body.bodyFatRate}%` : "-"}
                  </span>
                </div>
              ))
            )}
          </div>
        </SafeInner>
      </div>
    </div>
  );
}
