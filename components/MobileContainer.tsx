import { PropsWithChildren } from "react";
import { isMobile } from "react-device-detect";

export default function MobileContainer({ children }: PropsWithChildren) {

  if(!isMobile) {
    return <div className="h-dvh w-full flex flex-col max-w-md mx-auto relative bg-background">{children}</div>;
  }

  return (
    <div className="h-dvh w-full flex flex-col max-w-md mx-auto relative bg-background overflow-y-auto overflow-x-hidden scrollbar-hide">
      {children}
    </div>
  );
}
