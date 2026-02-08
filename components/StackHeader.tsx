"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StackHeader() {
  const router = useRouter();

  return (
    <header className="flex items-center py-2 h-16">
      <button type="button" className="cursor-pointer" onClick={() => router.back()}>
        <ChevronLeft />
      </button>
    </header>
  );
}
