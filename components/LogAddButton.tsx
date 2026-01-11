"use client";

import LogDrawer from "./LogDrawer";

export default function LogAddButton() {
  return (
    <>
      <LogDrawer>
        <button className="fixed z-10 bottom-24 py-4 px-6 left-1/2 -translate-x-1/2 bg-primary rounded-full shadow-lg text-white hover:bg-primary/80 active:scale-95 transition-transform cursor-pointer flex items-center gap-2">
          ✨ 기록 추가하기
        </button>
      </LogDrawer>
    </>
  );
}
