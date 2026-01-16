"use client";

import SafeInner from "@/components/SafeInner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

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
    <div className="h-dvh flex flex-col">
      <SafeInner className="flex-1 flex items-center">
        <div>
          함께하는 체중 관리, <br />
          FitCrew와 시작하세요!
        </div>
      </SafeInner>
      <SafeInner className="flex flex-col gap-1 py-6">
        <Button type="button" variant="outline" onClick={handleKakaoLogin}>
          카카오로 시작하기
        </Button>
        <Button type="button" variant="outline" onClick={handleGoogleLogin}>
          구글로 시작하기
        </Button>
      </SafeInner>
    </div>
  );
}
