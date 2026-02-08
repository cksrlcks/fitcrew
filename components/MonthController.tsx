"use client";

import { isSameMonth } from "date-fns";
import { useLogContext } from "./provider/LogProvider";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MonthController() {
  const { setDate, displayDate, setDisplayDate } = useLogContext();

  const handlePrevMonth = () => {
    const prevMonthDate = new Date(displayDate);
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
    setDisplayDate(prevMonthDate);

    if (isSameMonth(new Date(), prevMonthDate)) {
      setDate(new Date());
    } else {
      //마지막일을 선택
      setDate(
        new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth() + 1, 0),
      );
    }
  };

  const handleNextMonth = () => {
    const nextMonthDate = new Date(displayDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    setDisplayDate(nextMonthDate);

    if (isSameMonth(new Date(), nextMonthDate)) {
      setDate(new Date());
    } else {
      // 처음일을 선택
      setDate(
        new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), 1),
      );
    }
  };

  const currentMonth = displayDate.getMonth();
  const currentYear = displayDate.getFullYear();

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-xl font-bold tracking-tight flex items-center gap-1">
        {currentYear}년 {currentMonth + 1}월
      </div>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          variant="default"
          onClick={() => setDisplayDate(new Date())}
        >
          오늘
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          onClick={handlePrevMonth}
        >
          <ChevronLeft size={10} />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          onClick={handleNextMonth}
        >
          <ChevronRight size={10} />
        </Button>
      </div>
    </div>
  );
}
