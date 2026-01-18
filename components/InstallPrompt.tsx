"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import SafeInner from "./SafeInner";
import { Button } from "./ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [isOpen, setIsOpen] = useState(true);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const isStandalone =
    typeof window !== "undefined" &&
    ((window.navigator as any).standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches);

  const isIOS =
    typeof window !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream;

  /** 설치 가능 여부 캐치 (상태 저장 목적 아님) */
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  /** 설치 버튼 클릭: 조건 안 맞으면 조용히 종료 */
  const handleInstallClick = async () => {
    if (isStandalone) return;
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
  };

  /** 앱(PWA) 실행 중이거나 닫힌 상태면 미노출 */
  if (isStandalone || !isOpen) return null;

  return (
    <div className="bg-[#0F172B] p-4 border border-gray-200 text-white flex items-center gap-2">
      <Image
        src="/icon-512x512.png"
        alt="Install Icon"
        width={48}
        height={48}
        className="-ml-2"
      />

      <div className="text-sm flex-1">
        <div>Fitcrew 앱설치</div>
        {true && (
          <div className="text-xs opacity-50">
            아이폰은 공유 버튼 → 홈화면에 추가
          </div>
        )}
      </div>

      <div className="flex gap-1">
        <Button variant="default" onClick={handleInstallClick}>
          설치
        </Button>

        <Button
          type="button"
          variant="outline"
          className="bg-transparent border-white/20"
          onClick={() => setIsOpen(false)}
        >
          닫기
        </Button>
      </div>
    </div>
  );
}
