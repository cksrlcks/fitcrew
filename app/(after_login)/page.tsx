"use client";

import Chart from "@/components/Chart";
import { useLogContext } from "@/components/provider/LogProvider";
import Quick from "@/components/Quick";
import { Separator } from "@/components/ui/separator";
import WeekStatus from "@/components/WeekStatus";
import { format } from "date-fns";

export default function Page() {
  const { date, currentData, lastInjectionDate, data } = useLogContext();

  const chartData = data?.map((log) => ({
    date: format(new Date(log.date), "MM/dd"),
    weight: log.body?.weight ?? null,
  }));

  return (
    <>
      <WeekStatus />
      <Separator className="h-2! bg-gray-100 my-3" />
      <div className="space-y-6">
        <Quick
          date={date}
          data={currentData}
          lastInjectionDate={lastInjectionDate}
        />
        <Chart data={chartData ?? []} />
      </div>
    </>
  );
}
