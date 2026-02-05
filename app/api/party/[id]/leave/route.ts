import { NextResponse } from "next/server";
import * as partyService from "@/lib/db/service/parties";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// 파티 탈퇴 (DELETE)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const userId = session.user.id;

    await partyService.leaveParty(id, userId);

    return NextResponse.json({ message: "탈퇴되었습니다." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
