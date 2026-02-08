import { auth } from "@/lib/auth";
import { checkUserInParty, getPartySummary } from "@/lib/db/service/parties";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req:Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // 1. check if user is in a party
  try {
    const isUserInParty = await checkUserInParty(id, session.user.id);
    if (!isUserInParty) {
      return NextResponse.json(
        { error: "파티에 속한 유저가 아닙니다." },
        { status: 403 },
      );
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // 2. if yes, get party summary data
  try {
    const partySummaryData = await getPartySummary(id);
    return NextResponse.json({ data: partySummaryData });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
