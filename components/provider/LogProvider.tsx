"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import LogDrawer from "../LogDrawer";
import { useQuery } from "@tanstack/react-query";
import { DailyLog } from "@/lib/type";
import { format, startOfWeek } from "date-fns";
import { useAuth } from "@/hook/useAuth";

type LogType = "weight" | "injection";

type LogContextType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  type: LogType;
  setType: (type: LogType) => void;
  onOpen: (value: boolean, type: LogType, date?: Date) => void;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  data?: { [key: string]: DailyLog };
  lastInjectionDate?: string;
  isLoading: boolean;
  currentData?: DailyLog;
  displayDate: Date;
  setDisplayDate: React.Dispatch<React.SetStateAction<Date>>;
};
export const LogContext = createContext<LogContextType | null>(null);

export const LogProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<LogType>("weight");
  const [date, setDate] = useState<Date>(new Date());
  const [displayDate, setDisplayDate] = useState(date);
  const { session } = useAuth();

  const onOpen = (value: boolean, logType: LogType, date?: Date) => {
    setIsOpen(value);
    setType(logType);
    setDate(date || new Date());
  };

  const { data, isPending } = useQuery<{
    data: { [key: string]: DailyLog };
    lastInjectionDate?: string;
  }>({
    queryKey: ["logs"],
    queryFn: async () => {
      const response = await fetch(`/api/log`);

      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }

      return response.json();
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 10,
    enabled: !!session,
  });

  const currentData = data?.data[format(date, "yyyy-MM-dd")];

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
        displayDate,
        setDisplayDate,
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
