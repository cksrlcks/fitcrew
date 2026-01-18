"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import PWAIcon from '@/assets/image/icon-pwa.svg'

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
    ((window.navigator as unknown as { standalone?: boolean }).standalone ===
      true ||
      window.matchMedia("(display-mode: standalone)").matches);

  const isIOS =
    typeof window !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as unknown as { MSStream?: string }).MSStream;

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

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
    <div className="bg-[#0F172B] p-4 border border-gray-200 text-white flex items-center gap-3">
      <Image
        src={PWAIcon}
        alt="Install Icon"
        width={60}
        height={60}
      />

      <div className="text-sm flex-1">
        <div>Fitcrew 설치</div>
        <div className="text-xs opacity-50">
          {isIOS
            ? "하단의 공유 아이콘을 눌러 '홈 화면에 추가'를 선택하여 설치할 수 있습니다."
            : "앱처럼 편하게 사용해보세요."}
        </div>
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
