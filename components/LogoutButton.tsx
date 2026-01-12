"use client";

import { supabase } from "@/lib/supabase/client";
import { Button } from "./ui/button";

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace("/");
  };

  return (
    <>
      <Button type="button" onClick={handleLogout}>
        로그아웃
      </Button>
    </>
  );
}
