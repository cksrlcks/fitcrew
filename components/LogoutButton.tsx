"use client";

import { authClient } from "@/lib/auth-client";
import { useTransition } from "react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      await authClient.signOut();
      window.location.href = "/";
    });
  };

  return (
    <button type="button" onClick={handleLogout} disabled={isPending} className="flex items-center cursor-pointer hover:opacity-70">
      <LogOut size={20}/>
      <span className="sr-only">로그아웃</span>
    </button>
  );
}
