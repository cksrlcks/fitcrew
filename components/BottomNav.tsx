"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, TrendingUp, Users } from "lucide-react";
import LogAddButton from "./LogAddButton";

type View = "dashboard" | "party" | "progress";
type NavItem = {
  label: string;
  href: string;
  view: View;
  icon: React.ReactElement<LucideIcon>;
}

function getActiveView(pathname: string): View | null {
  if (pathname.startsWith("/party")) {
    return "party";
  } else if (pathname.startsWith("/progress")) {
    return "progress";
  } else if (pathname === "/" || pathname.startsWith("/dashboard")) {
    return "dashboard";
  }

  return null;
}

const Nav: NavItem[] = [
  { label: "진행상황", href: "/progress", view: "progress", icon: <TrendingUp size={18} /> },
  { label: "파티", href: "/party", view: "party", icon: <Users size={18} /> },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-0 right-0 max-w-md mx-auto bg-card rounded-full">
      <LogAddButton />
      
      <ul className="flex justify-around py-2 ">
        {Nav.map(({ label, href, view, icon }) => {
          const activeView = getActiveView(pathname);
          const isActive = activeView === view;

          return (
            <li key={view}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center py-2",
                  isActive ? "text-primary" : "text-gray-500"
                )}
              >
                <span className="mb-1">{icon}</span>
                <span className={cn("text-xs", isActive && "font-semibold")}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
