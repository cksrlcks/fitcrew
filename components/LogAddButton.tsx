"use client";

import { Plus } from "lucide-react";
import { useLogContext } from "./provider/LogProvider";
import { Spinner } from "./ui/spinner";

export default function LogAddButton() {
  const { onOpen, date, isLoading } = useLogContext();

  return (
    <>
      <button
        type="button"
        className="absolute z-10 -top-6 w-16 h-16 flex items-center justify-center left-1/2 -translate-x-1/2 bg-primary rounded-full hover:bg-primary/80 active:scale-95 transition-transform cursor-pointer gap-2 text-black"
        onClick={() => onOpen(true, "weight", date)}
        disabled={isLoading}
      >
       {isLoading ? <Spinner /> : <Plus strokeWidth={2} size={28}/>}
      </button>
    </>
  );
}
