import LogoutButton from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supbase = await createClient();
  const {
    data: { user },
  } = await supbase.auth.getUser();

  return (
    <div>
      <div>대시보드 페이지</div>
      <div>
        {user
          ? `환영합니다, ${user.user_metadata.name}님!`
          : "사용자 정보를 불러올 수 없습니다."}
      </div>

      <div>
        <LogoutButton />
      </div>
    </div>
  );
}
