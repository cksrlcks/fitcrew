"use client";

import SafeInner from "@/components/SafeInner";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Logo from "@/assets/image/logo.svg";
import { SocialButton } from "@/components/SocialButton";
import IconGoogle from "@/assets/image/icon-google.svg";
import IconKakao from "@/assets/image/icon-kakao.svg";

export default function LoginPage() {
  const handleKakaoLogin = async () => {
    await authClient.signIn.oauth2({
      providerId: "kakao",
      callbackURL: "/",
    });
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <SafeInner className="fiexd inset-0 h-full flex flex-col justify-center gap-8 px-8">
      <div className="flex items-center">
        <div className="space-y-4">
          <Image src={Logo} alt="FitCrew" className="h-6 w-auto" />
          <div className="opacity-70 tracking-tight">
            함께하는 체중 관리, 핏크루와 시작하세요!
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <SocialButton
          icon={IconKakao}
          label="카카오로 시작하기"
          className="border-[#f2d413] bg-[#fee400] text-slate-950 hover:bg-[#fed800]"
          onClick={handleKakaoLogin}
        />
        <SocialButton
          icon={IconGoogle}
          label="구글로 시작하기"
          onClick={handleGoogleLogin}
        />
      </div>
    </SafeInner>
  );
}
