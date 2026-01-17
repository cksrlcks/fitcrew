"use client";

import WeekCalendar from "./WeekCalendar";
import SafeInner from "./SafeInner";
import Calendar from "./Calendar";
import { useLogContext } from "./provider/LogProvider";

export default function WeekStatus() {
  const { date, setDate, from, end, weekData } = useLogContext();
  
  return (
    <div className="space-y-4">
      <SafeInner className="border-b border-b-gray-100">
        <Calendar
          date={date}
          setDate={(newDate) => setDate(newDate || new Date())}
        />
      </SafeInner>

      <div>
        <SafeInner className="lg:px-0">
          <WeekCalendar
            date={date}
            setDate={setDate}
            fromDate={from}
            endDate={end}
          />
        </SafeInner>
        <SafeInner className="lg:px-0">
          <div className="flex justify-around gap-1 h-12.5">
            {weekData?.map((item, index) => (
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
            ))}
          </div>
        </SafeInner>
      </div>
    </div>
  );
}
