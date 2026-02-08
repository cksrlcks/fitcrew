"use client";

import { authClient } from "@/lib/auth-client";
import { useTransition } from "react";

export function useAuth() {
  const { data: session, isPending } = authClient.useSession();

  const [isLogoutPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      await authClient.signOut();
      window.location.href = "/";
    });
  };

  return {
    loading: isPending,
    session,
    isLogoutPending,
    handleLogout,
  };
}
