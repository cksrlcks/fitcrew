"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import LogDrawer from "../LogDrawer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DailyLog } from "@/lib/type";
import { addDays, addWeeks, format, startOfWeek } from "date-fns";

type LogType = "weight" | "injection";

type LogContextType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  type: LogType;
  setType: (type: LogType) => void;
  onOpen: (value: boolean, type: LogType, date?: Date) => void;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  currentData?: DailyLog;
  data?: DailyLog[];
  lastInjectionDate?: string;
  isLoading: boolean;
  formattedData?: (DailyLog | null)[];
  dataByDate?: Record<string, DailyLog>;
  weekDataMap: WeekDataMap;
};

type WeekDataMap = {
  [weekKey: string]: Record<string, DailyLog>;
};

export const LogContext = createContext<LogContextType | null>(null);

export const LogProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<LogType>("weight");
  const [date, setDate] = useState<Date>(new Date());

  const queryClient = useQueryClient();

  const weekStart = getWeekKey(date);
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    addDays(getWeekStart(date), i),
  );

  const currentWeekKey = getWeekKey(date);
  const prevWeekKey = getWeekKey(addWeeks(date, -1));
  const nextWeekKey = getWeekKey(addWeeks(date, 1));

  const onOpen = (value: boolean, logType: LogType, date?: Date) => {
    setIsOpen(value);
    setType(logType);
    setDate(date || new Date());
  };

  const { data, isPending } = useQuery<{
    data: DailyLog[];
    lastInjectionDate?: string;
  }>({
    queryKey: ["logs", weekStart],
    queryFn: async () => {
      const response = await fetch(`/api/log?weekStart=${weekStart}`);

      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }

      return response.json();
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    const weekKeys = [
      getWeekKey(addWeeks(date, -2)),
      getWeekKey(addWeeks(date, -1)),
      getWeekKey(date),
      getWeekKey(addWeeks(date, 1)),
      getWeekKey(addWeeks(date, 2)),
    ];

    weekKeys.forEach((weekKey) => {
      const exists = queryClient.getQueryData(["logs", weekKey]);
      if (!exists) {
        queryClient.prefetchQuery({
          queryKey: ["logs", weekKey],
          queryFn: () =>
            fetch(`/api/log?weekStart=${weekKey}`).then((r) => r.json()),
          staleTime: Infinity,
        });
      }
    });
  }, [date, queryClient]);

  const dataByDate = data?.data?.reduce<Record<string, DailyLog>>(
    (acc, cur) => {
      acc[cur.date] = cur;
      return acc;
    },
    {},
  );

  const formattedData = weekDates.map((d) => {
    const key = format(d, "yyyy-MM-dd");
    return dataByDate?.[key] ?? null;
  });

  const currentData = dataByDate?.[format(date, "yyyy-MM-dd")];

  const weekKeys = [prevWeekKey, currentWeekKey, nextWeekKey];

  const weekDataMap: WeekDataMap = {};

  weekKeys.forEach((key) => {
    const cached = queryClient.getQueryData<{ data: DailyLog[] }>([
      "logs",
      key,
    ]);

    if (cached?.data) {
      weekDataMap[key] = cached.data.reduce<Record<string, DailyLog>>(
        (acc, cur) => {
          acc[cur.date] = cur;
          return acc;
        },
        {},
      );
    }
  });

  return (
    <LogContext.Provider
      value={{
        isOpen,
        setIsOpen,
        type,
        setType,
        onOpen,
        date,
        setDate,
        currentData,
        data: data?.data,
        lastInjectionDate: data?.lastInjectionDate,
        isLoading: isPending,
        formattedData,
        dataByDate,
        weekDataMap,
      }}
    >
      {children}
      <LogDrawer />
    </LogContext.Provider>
  );
};

export const useLogContext = () => {
  const context = useContext(LogContext);

  if (!context) {
    throw new Error("useLogContext must be used within a LogProvider");
  }

  return context;
};

export function getWeekKey(date: Date) {
  return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
}

export function getWeekStart(date: Date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}
