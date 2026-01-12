import{ PropsWithChildren } from "react";
import BottomNav from "@/components/BottomNav";
import LogAddButton from "@/components/LogAddButton";

export default function AfterLoginLayout({ children }: PropsWithChildren) {
  return (
    <div className="pb-20">
      {children}

      <LogAddButton />
      <BottomNav />
    </div>
  );
}
