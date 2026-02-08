import SafeInner from "@/components/SafeInner";
import StackHeader from "@/components/StackHeader";
import { PropsWithChildren } from "react";

export default function StackLayout({ children }: PropsWithChildren) {
  return (
    <SafeInner className="space-y-4 pb-10">
      <StackHeader />
      {children}
    </SafeInner>
  );
}
