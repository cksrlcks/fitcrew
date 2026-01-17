import { auth } from "@/lib/auth";
import {
  getBodyLogs,
  getInjectionLogs,
  getLastInjectionDate,
  upsertBodyLog,
  upsertInjectionLog,
} from "@/lib/db/service/logs";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { eachDayOfInterval, format } from "date-fns";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json(
      { message: "from and to are required (YYYY-MM-DD)" },
      { status: 400 },
    );
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const start = new Date(from + "T00:00:00");
  const end = new Date(to + "T00:00:00");

  const dates = eachDayOfInterval({ start, end }).map((d) =>
    format(d, "yyyy-MM-dd"),
  );

  const [bodyLogs, injectionLogs, lastInjectionDate] = await Promise.all([
    getBodyLogs({
      userId: session.user.id,
      from,
      to,
    }),
    getInjectionLogs({
      userId: session.user.id,
      from,
      to,
    }),
    getLastInjectionDate({
      userId: session.user.id,
    }),
  ]);

  const bodyMap = new Map(bodyLogs.map((log) => [log.logDate, log]));
  const injectionMap = new Map(injectionLogs.map((log) => [log.logDate, log]));

  const data = dates.map((date) => ({
    date,
    body: bodyMap.get(date) ?? null,
    injection: injectionMap.get(date) ?? null,
  }));

  return NextResponse.json({
    data,
    lastInjectionDate,
  });
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const res = await request.json();

  if (res.type === "body") {
    // add body log
    const result = await upsertBodyLog({
      userId: session.user.id,
      logDate: res.logDate,
      weight: res.weight,
      bodyFatRate: res.bodyFatRate,
      muscleMass: res.muscleMass,
    });

    return NextResponse.json({ data: result });
  } else if (res.type === "injection") {
    // add injection log
    const result = await upsertInjectionLog({
      userId: session.user.id,
      logDate: res.logDate,
      dosage: res.dosage,
      drugType: res.drugType,
      note: res.note,
    });

    return NextResponse.json({ data: result });
  } else {
    return NextResponse.json({ message: "Invalid log type" }, { status: 400 });
  }
}
