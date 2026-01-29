"use client";

import { redirect, usePathname } from "next/navigation";
import { useAuth } from "@/hook/useAuth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, session } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return null;
  }

  if (!session && pathname !== "/login") {
    return redirect("/login");
  }

  return <>{children}</>;
}
