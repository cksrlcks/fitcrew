"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";
import LogDrawer from "../LogDrawer";

type LogType = "weight" | "injection";

type LogContextType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  type: LogType;
  onOpen: (value: boolean, type: LogType) => void;
};

export const LogContext = createContext<LogContextType | null>(null);

export const LogProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<LogType>("weight");

  const onOpen = (value: boolean, logType: LogType) => {
    setIsOpen(value);
    setType(logType);
  };

  return (
    <LogContext.Provider value={{ isOpen, setIsOpen, type, onOpen }}>
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
