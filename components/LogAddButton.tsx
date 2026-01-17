"use client";

import { useLogContext } from "./provider/LogProvider";

export default function LogAddButton() {
  const { onOpen } = useLogContext();

  return (
    <>
      <button
        type="button"
        className="fixed z-10 bottom-24 py-4 px-6 left-1/2 -translate-x-1/2 bg-primary rounded-full shadow-lg text-white hover:bg-primary/80 active:scale-95 transition-transform cursor-pointer flex items-center gap-2"
        onClick={() => onOpen(true, "weight")}
      >
        ✨ 기록 추가하기
      </button>
    </>
  );
}
