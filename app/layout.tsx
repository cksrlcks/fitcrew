import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/provider/QueryProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import MobileContainer from "@/components/MobileContainer";
import { LogProvider } from "@/components/provider/LogProvider";

export const metadata: Metadata = {
  title: "FitCrew - 같이 관리하는 체중 관리 앱",
  description: "팀원과 함께 관리하는 체중 관리 앱입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <NuqsAdapter>
        <LogProvider>
          <html lang="ko">
            <body className="antialiased bg-gray-100">
              <MobileContainer>{children}</MobileContainer>
              <Toaster />
            </body>
          </html>
        </LogProvider>
      </NuqsAdapter>
    </QueryProvider>
  );
}
