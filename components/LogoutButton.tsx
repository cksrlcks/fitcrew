"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useTransition } from "react";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      await authClient.signOut();
      window.location.href = "/";
    })
  };

  return (
    <>
      <Button type="button" onClick={handleLogout} disabled={isPending}>
        로그아웃
      </Button>
    </>
  );
}
