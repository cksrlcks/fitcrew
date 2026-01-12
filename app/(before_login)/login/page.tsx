"use client";

import SafeInner from "@/components/SafeInner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const handleKakaoLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "login",
        },
      },
    });

    if (error) {
      console.error("Error during Kakao login:", error);
      toast.error("카카오 로그인 중 오류가 발생했습니다.");
      return;
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      console.error("Error during Google login:", error);
      toast.error("구글 로그인 중 오류가 발생했습니다.");
    }
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
