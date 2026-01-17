import { PropsWithChildren } from "react";
import BottomNav from "@/components/BottomNav";
import LogAddButton from "@/components/LogAddButton";
import RootHeader from "@/components/RootHeader";

export default function AfterLoginLayout({ children }: PropsWithChildren) {
  return (
    <div className="pb-60">
      <RootHeader />
      {children}

      <LogAddButton />
      <BottomNav />
    </div>
  );
}
