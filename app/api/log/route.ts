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
import { DailyLog } from "@/lib/type";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }


  const [bodyLogs, injectionLogs, lastInjectionDate] = await Promise.all([
    getBodyLogs({
      userId: session.user.id,
    }),
    getInjectionLogs({
      userId: session.user.id,
    }),
    getLastInjectionDate({
      userId: session.user.id,
    }),
  ]);

  const dataMap = new Map();

  bodyLogs.forEach((log) => {
    dataMap.set(log.logDate, { date: log.logDate, body: log, injection: null });
  });

  injectionLogs.forEach((log) => {
    const existing = dataMap.get(log.logDate);
    if (existing) {
      existing.injection = log;
    } else {
      dataMap.set(log.logDate, { date: log.logDate, body: null, injection: log });
    }
  });

  return NextResponse.json({
    data: Object.fromEntries(dataMap),
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
