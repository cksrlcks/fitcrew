import { cn, DEFAULT_COLORS, getColorByString } from "@/lib/utils";
import { format } from "date-fns";
import { Check } from "lucide-react";
import React from "react";

type SummaryCardProps = {
  name: string;
  current: number;
  totalChange: number;
  lossRate: number;
  recentLogs?: { date: string; weight: number | null }[];
  streakDays?: number;
};

export default function SummaryCard({
  name,
  current,
  totalChange,
  lossRate,
  recentLogs,
  streakDays,
}: SummaryCardProps) {
  return (
    <div className="bg-card p-6 rounded-lg space-y-4 relative">
      {/* <span className="text-yellow-300 font-medium bg-yellow-300/10 px-2 py-1.5 text-xs rounded-md absolute top-5 right-5">연속기록 {streakDays}일</span> */}
      <div className="font-medium flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: getColorByString(name[0], DEFAULT_COLORS) }}
        ></span>
        {name}
      </div>

      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">현재 몸무게</div>
        <div className="text-2xl font-semibold">
          {current != null ? `${current} kg` : "기록 없음"}
        </div>
        <span
          className={cn(
            "text-sm font-semibold",
            totalChange < 0
              ? "text-green-500"
              : totalChange > 0
                ? "text-red-500"
                : "text-foreground",
          )}
        >
          {totalChange != null ? `${totalChange} kg` : "기록 없음"} (
          {lossRate != null ? `${lossRate} %` : "기록 없음"})
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">최근 7일 기록</div>          
        </div>

        <div className="flex gap-1">
          {recentLogs?.map((log) => {
            const isChecked = log.weight != null;

            return (
              <div
                key={log.date}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <div
                  className={cn(
                    "w-full h-3.5 flex items-center justify-center rounded-[2px]",
                    isChecked
                      ? "bg-primary/20 text-primary border border-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {isChecked ? <Check size={10} /> : "-"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {format(new Date(log.date), "MM/dd")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
