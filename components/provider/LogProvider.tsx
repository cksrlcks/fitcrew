"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";
import LogDrawer from "../LogDrawer";
import { useQuery } from "@tanstack/react-query";
import { DailyLog } from "@/lib/type";
import { endOfWeek, format, isSameDay, startOfWeek } from "date-fns";

type LogType = "weight" | "injection";

type LogContextType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  type: LogType;
  setType: (type: LogType) => void;
  onOpen: (value: boolean, type: LogType, date?: Date) => void;
  date: Date;
  setDate: (date: Date) => void;
  currentData?: DailyLog;
  weekData?: DailyLog[];
  lastInjectionDate?: string;
  from: Date;
  end: Date;
  isLoading: boolean;
};

export const LogContext = createContext<LogContextType | null>(null);

export const LogProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<LogType>("weight");
  const [date, setDate] = useState<Date>(new Date());

  const from = startOfWeek(date);
  const end = endOfWeek(date);

  const onOpen = (value: boolean, logType: LogType, date?: Date) => {
    setIsOpen(value);
    setType(logType);
    setDate(date || new Date());
  };

  const { data, isPending } = useQuery<{ data: DailyLog[]; lastInjectionDate?: string }>({
    queryKey: ["logs", from, end],
    queryFn: async () => {
      const response = await fetch(
        `/api/log?from=${format(from, "yyyy-MM-dd")}&to=${format(end, "yyyy-MM-dd")}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }

      return response.json();
    },
  });

  const currentData = data?.data.find((item) =>
    isSameDay(new Date(item.date), date),
  );

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
        weekData: data?.data,
        lastInjectionDate: data?.lastInjectionDate,
        from,
        end,
        isLoading: isPending,
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
