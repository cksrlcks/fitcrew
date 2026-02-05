import { NextResponse } from "next/server";
import * as partyService from "@/lib/db/service/parties";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// 파티 상세 (GET)
export async function GET(
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
    const data = await partyService.getPartyDetail(id, session.user.id);

    if (!data) {
      return NextResponse.json(
        { error: "존재하지 않는 파티입니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 파티 수정 (PATCH)
export async function PATCH(
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
    const { name }: { name: string } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "수정할 이름을 입력해주세요." },
        { status: 400 },
      );
    }

    const data = await partyService.updateParty(id, userId, name);

    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "오류가 발생했습니다.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 파티 삭제 (DELETE)
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

    await partyService.deleteParty(id, userId);
    
    return NextResponse.json({ message: "파티가 해산되었습니다." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "오류가 발생했습니다.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
