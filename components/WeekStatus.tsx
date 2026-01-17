"use client";

import WeekCalendar from "./WeekCalendar";
import SafeInner from "./SafeInner";
import Calendar from "./Calendar";
import { useState } from "react";

const data = [
  { weight: "83.4kg", bodyFat: "34.1%" },
  { weight: null, bodyFat: "34.1%" },
  { weight: "83.4kg", bodyFat: "34.1%" },
  { weight: "83.4kg", bodyFat: null },
  { weight: "83.4kg", bodyFat: "34.1%" },
  { weight: null, bodyFat: "34.1%" },
  { weight: null, bodyFat: "34.1%" },
]
export default function WeekStatus() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className="space-y-4">
      <SafeInner className="border-b border-b-gray-100">
        <Calendar date={date} setDate={setDate} />
      </SafeInner>

      <div>
        <SafeInner className="lg:px-0">
          <WeekCalendar date={date} />
        </SafeInner>
        <SafeInner className="lg:px-0">
          <div className="flex justify-around gap-1">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-1/2 items-center text-center w-full py-2 max-w-13 select-none text-[11px] font-semibold"
              >
                <span className="">{item.weight ?? "-"}</span>
                <span className="opacity-50">{item.bodyFat ?? "-"}</span>
              </div>
            ))}
          </div>
        </SafeInner>
      </div>
    </div>
  );
}
