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
import { eachDayOfInterval, formatDate } from "date-fns";

function toKSTStartOfDay(iso: string): Date {
  const d = new Date(iso);

  // KST 보정
  d.setHours(d.getHours() + 9);

  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function buildDateRangeUTC(fromISO: string, toISO: string): string[] {
  const start = toKSTStartOfDay(fromISO);
  const end = toKSTStartOfDay(toISO);
  end.setDate(end.getDate() - 1);

  return eachDayOfInterval({ start, end }).map((d) =>
    formatDate(d, "yyyy-MM-dd"),
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const fromRaw = searchParams.get("from");
  const toRaw = searchParams.get("to");

  if (!fromRaw || isNaN(Date.parse(fromRaw))) {
    return NextResponse.json(
      { message: "from is not valid date" },
      { status: 400 },
    );
  }

  if (!toRaw || isNaN(Date.parse(toRaw))) {
    return NextResponse.json(
      { message: "to is not valid date" },
      { status: 400 },
    );
  }
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const dates = buildDateRangeUTC(fromRaw, toRaw);

  const fromDate = dates[0];
  const toDate = dates[dates.length - 1];
  console.log({ fromDate, toDate });

  const [bodyLogs, injectionLogs, lastInjectionDate] = await Promise.all([
    getBodyLogs({
      userId: session.user.id,
      from: fromDate,
      to: toDate,
    }),
    getInjectionLogs({
      userId: session.user.id,
      from: fromDate,
      to: toDate,
    }),
    getLastInjectionDate({
      userId: session.user.id,
    }),
  ]);

  const bodyMap = new Map(bodyLogs.map((log) => [log.logDate, log]));
  const injectionMap = new Map(injectionLogs.map((log) => [log.logDate, log]));

  const result = dates.map((date) => ({
    date,
    body: bodyMap.get(date) ?? null,
    injection: injectionMap.get(date) ?? null,
  }));

  return NextResponse.json({
    data: result,
    lastInjectionDate: lastInjectionDate,
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
