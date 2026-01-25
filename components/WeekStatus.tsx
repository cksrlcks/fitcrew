"use client";

import WeekCalendar from "./WeekCalendar";
import SafeInner from "./SafeInner";
import Calendar from "./Calendar";
import { useLogContext } from "./provider/LogProvider";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { endOfWeek, isWithinInterval, startOfWeek } from "date-fns";

export default function WeekStatus() {
  const { date, setDate, displayDate, setDisplayDate } = useLogContext();

  const handlePrevWeek = () => {
    const prevWeekDate = new Date(displayDate);
    prevWeekDate.setDate(prevWeekDate.getDate() - 7);
    setDisplayDate(prevWeekDate);
  };
  const handleNextWeek = () => {
    const nextWeekDate = new Date(displayDate);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    setDisplayDate(nextWeekDate);
  };

  // displayDate의 주에 오늘 날짜가 포함되는지 여부
  const isShowToday = !isWithinInterval(new Date(), {
    start: startOfWeek(displayDate, { weekStartsOn: 1 }), // 월요일 시작
    end: endOfWeek(displayDate, { weekStartsOn: 1 }),
  });

  return (
    <div className="space-y-4">
      <SafeInner className="border-b border-b-gray-100 flex items-center justify-between pb-4">
        <Calendar
          date={date}
          setDate={(newDate) => {
            setDisplayDate(newDate || new Date());
            setDate(newDate || new Date());
          }}
        />
        <div className="flex items-center gap-1">
          {isShowToday && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setDisplayDate(new Date())}
            >
              오늘
            </Button>
          )}
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            onClick={handlePrevWeek}
          >
            <ChevronLeft size={10} />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            onClick={handleNextWeek}
          >
            <ChevronRight size={10} />
          </Button>
        </div>
      </SafeInner>

      <SafeInner>
        <WeekCalendar />
      </SafeInner>
    </div>
  );
}
