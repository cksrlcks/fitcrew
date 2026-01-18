"use client";

import dynamic from "next/dynamic";

const InstallPrompt = dynamic(() => import("@/components/InstallPrompt"), {
  ssr: false,
});

export default function PWA() {
  return <InstallPrompt />;
}