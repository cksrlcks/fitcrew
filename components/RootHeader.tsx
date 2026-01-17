import Image from "next/image";
import SafeInner from "./SafeInner";
import Logo from "@/assets/image/logo.svg";
import LogoutButton from "./LogoutButton";

export default function RootHeader() {
  return (
    <SafeInner className="flex h-20 items-center justify-between">
      <div>
        <Image src={Logo} alt="FitCrew" className="h-4 w-auto" />
      </div>
      <div className="pr-2">
        <LogoutButton />
      </div>
    </SafeInner>
  );
}
