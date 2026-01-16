import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <div>대시보드 페이지</div>
      <div>
        {session
          ? `환영합니다, ${session.user.name}님!`
          : "사용자 정보를 불러올 수 없습니다."}
      </div>
      <LogoutButton />
    </div>
  );
}
