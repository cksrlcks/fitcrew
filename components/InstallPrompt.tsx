"use client";

import Image from "next/image";
import SafeInner from "./SafeInner";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
export default function InstallPrompt() {
  const [isOpen, setIsOpen] = useState(true);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as unknown as { MSStream?: string }).MSStream;
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsOpen(false);
    }

    setDeferredPrompt(null);
  };

  if (isStandalone) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-2 left-0 z-50 w-full pb-[env(safe-area-inset-bottom)]">
      <SafeInner className="max-w-125 mx-auto px-8">
        <div className="bg-[#0F172B] rounded-lg p-4 border border-gray-200 text-white">
          <Image
            src="/icon-512x512.png"
            alt="Install Icon"
            width={80}
            height={80}
            className="-ml-2"
          />
          <div className="text-center pb-6">
            <div>홈 화면에 앱을 추가하실수 있어요.</div>
            {isIOS && (
              <div className="text-sm opacity-50">
                아이폰의 경우 Safari 공유 버튼을 눌러 설치하세요.
              </div>
            )}
          </div>
          <div className="space-y-1">
            {!isIOS && deferredPrompt && (
              <Button
                variant="default"
                className="w-full"
                onClick={handleInstallClick}
              >
                홈 화면에 추가
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent border-white/20"
              onClick={() => setIsOpen(false)}
            >
              닫기
            </Button>
          </div>
        </div>
      </SafeInner>
    </div>
  );
}
