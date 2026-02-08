import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/provider/QueryProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import MobileContainer from "@/components/MobileContainer";
import { LogProvider } from "@/components/provider/LogProvider";
//import PWA from "@/components/PWA";
import ServiceWorkerRegister from "@/components/ServiceWork";
import AuthProvider from "@/components/provider/AuthProvider";

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
    <html lang="ko" className="dark overflow-hidden">
      <body className="antialiased overflow-hidden">
        <QueryProvider>
          <NuqsAdapter>
            <AuthProvider>
              <LogProvider>
                <ServiceWorkerRegister />
                <MobileContainer>
                  {/* <PWA /> */}
                  {children}
                </MobileContainer>
                <Toaster position="bottom-center" theme="dark" />
              </LogProvider>
            </AuthProvider>
          </NuqsAdapter>
        </QueryProvider>
      </body>
    </html>
  );
}
