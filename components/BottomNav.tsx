"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, TrendingUp, Users } from "lucide-react";

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
  { label: "진행상황", href: "/", view: "dashboard", icon: <TrendingUp size={18} /> },
  { label: "파티", href: "/party", view: "party", icon: <Users size={18} /> },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white max-w-md mx-auto shadow-[0_-1px_16px_rgba(0,0,0,0.08)]">
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
