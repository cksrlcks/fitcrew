"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ko } from "react-day-picker/locale";
import { Separator } from "./ui/separator";
import { ChevronDownIcon } from "lucide-react";

interface CalendarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export default function Calendar({ date, setDate }: CalendarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 w-full cursor-pointer"
        >
          <span className="font-semibold tracking-tight">
            {format(date ?? new Date(), "yyyy년 MM월 dd일")}
          </span>
          <span className="bg-black flex items-center justify-center rounded-full w-4 h-4 -mt-0.5">
            <ChevronDownIcon className="size-3 text-white" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-semibold">날짜 선택</DialogTitle>
        <Separator />
        <CalendarComponent
          className="w-full p-0"
          mode="single"
          locale={ko}
          selected={date}
          onSelect={(date) => {
            setDate(date);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
