"use client";

import { useLogContext } from "@/components/provider/LogProvider";
import Quick from "@/components/Quick";
import { Separator } from "@/components/ui/separator";
import WeekStatus from "@/components/WeekStatus";

export default function Page() {
  const { date, setDate, currentData, weekData, from, end, lastInjectionDate } =
    useLogContext();

  return (
    <>
      <WeekStatus />
      <Separator className="h-2! bg-gray-100 my-3" />
      <Quick
        date={date}
        data={currentData}
        lastInjectionDate={lastInjectionDate}
      />
    </>
  );
}
