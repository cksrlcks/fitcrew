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
import { format, eachDayOfInterval } from "date-fns";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (from && isNaN(Date.parse(from))) {
    return NextResponse.json(
      { message: "from is not valid date" },
      { status: 400 },
    );
  }

  if (to && isNaN(Date.parse(to))) {
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

  const bodyMap = new Map(
    bodyLogs.map((log) => [log.logDate, log]),
  );

  const injectionMap = new Map(
    injectionLogs.map((log) => [log.logDate, log]),
  );

  const start = from ? new Date(from) : new Date();
  const end = to ? new Date(to) : new Date();

  const dates = eachDayOfInterval({ start, end }).map((d) =>
    format(d, "yyyy-MM-dd"),
  );

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
