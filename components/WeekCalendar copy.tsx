"use client";

import { cn } from "@/lib/utils";
import { format, isSameDay, addWeeks, addDays, startOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { useEffect, useMemo } from "react";
import { getWeekKey, useLogContext } from "./provider/LogProvider";
import useEmblaCarousel from "embla-carousel-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

function getWeekDates(baseDate: Date) {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export default function WeekCalendar() {
  const { setDate, date, weekDataMap } = useLogContext();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    startIndex: 1,
  });

  // 3주짜리 날짜 배열 (UI 전용)
  const weeks = useMemo(() => {
    return [
      getWeekDates(addWeeks(date, -1)),
      getWeekDates(date),
      getWeekDates(addWeeks(date, 1)),
    ];
  }, [date]);

  const weekKeys = useMemo(() => {
    return [
      getWeekKey(addWeeks(date, -1)),
      getWeekKey(date),
      getWeekKey(addWeeks(date, 1)),
    ];
  }, [date]);

  // 스와이프 감지 → date 변경
  useEffect(() => {
    if (!emblaApi) return;

    const onSettle = () => {
      const index = emblaApi.selectedScrollSnap();

      if (index === 0) {
        const prevWeekDate = new Date(date);
        prevWeekDate.setDate(date.getDate() - 7);

        setDate(prevWeekDate);
        setTimeout(() => {
          emblaApi.scrollTo(1, true);
        });
      }

      if (index === 2) {
        const nextWeekDate = new Date(date);
        nextWeekDate.setDate(date.getDate() + 7);
        setDate(nextWeekDate);
        setTimeout(() => {
          emblaApi.scrollTo(1, true);
        });
      }
    };

    emblaApi.on("settle", onSettle);

    return () => {
      emblaApi.off("settle", onSettle);
    };
  }, [emblaApi, setDate, date]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {weeks.map((weekDates, slideIndex) => {
            const dataForWeek = weekDataMap[weekKeys[slideIndex]] ?? {};

            return (
              <div
                key={slideIndex}
                className="embla__slide flex justify-around gap-1"
              >
                {weekDates.map((day, dayIndex) => {
                  return (
                    <div
                      key={day.toISOString()}
                      className="flex flex-col items-center gap-1 flex-1"
                    >
                      <button
                        type="button"
                        className={cn(
                          "flex flex-col gap-1 items-center w-full py-2 rounded-lg max-w-13",
                          (dayIndex === 5 || dayIndex === 6) &&
                            "text-orange-500",
                          isSameDay(day, date) &&
                            "bg-slate-800 text-white font-semibold",
                          isSameDay(day, new Date()) &&
                            !isSameDay(day, date) &&
                            "bg-orange-100/50",
                        )}
                        onClick={() => setDate(day)}
                      >
                        <span className="text-sm font-semibold">
                          {format(day, "dd")}
                        </span>
                        <span className="text-xs opacity-50">
                          {format(day, "EEE", { locale: ko })}
                        </span>
                      </button>

                      <div className="text-[11px] text-center font-semibold">
                        <div>
                          {dataForWeek[format(day, "yyyy-MM-dd")]?.body
                            ?.weight ?? "-"}
                        </div>
                        <div className="opacity-50">
                          {dataForWeek[format(day, "yyyy-MM-dd")]?.body
                            ?.bodyFatRate ?? "-"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
