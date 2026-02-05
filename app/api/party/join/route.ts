import { NextResponse } from "next/server";
import * as partyService from "@/lib/db/service/parties";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// 파티 가입 (POST)
export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const { inviteCode }: { inviteCode: string } = await req.json();

    if (!inviteCode) {
      return NextResponse.json(
        { error: "초대 코드를 입력해주세요." },
        { status: 400 },
      );
    }

    const data = await partyService.joinPartyByCode(inviteCode, userId);

    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
