import Image from "next/image";
import SafeInner from "./SafeInner";
import Logo from "@/assets/image/logo.svg";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { Smile } from "lucide-react";

export default function RootHeader() {
  return (
    <SafeInner className="flex h-20 items-center justify-between">
      <div>
        <Image src={Logo} alt="FitCrew" className="h-4 w-auto" />
      </div>
      <div className="pr-2 flex items-center gap-4">
        <Link href="/my" className="hover:text-primary">
          <Smile size={20}/>
        </Link>
        <LogoutButton />
      </div>
    </SafeInner>
  );
}
