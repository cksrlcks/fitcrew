"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/hook/useAuth";

export default function LogoutButton() {
  const { isLogoutPending, handleLogout } = useAuth();

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLogoutPending}
      className="flex items-center cursor-pointer hover:opacity-70"
    >
      <LogOut size={20} />
      <span className="sr-only">로그아웃</span>
    </button>
  );
}
