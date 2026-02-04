import "server-only";
import { db } from "..";
import { bodyLogs } from "../schema";
import { and, desc, eq } from "drizzle-orm";
import { injectionLogs } from "../schema/injection-logs";
import { BodyLogFormType } from "@/components/BodyLogForm";

export const getBodyLogs = async ({
  userId,
}: {
  userId: string;
}) => {
  return db
    .select()
    .from(bodyLogs)
    .where(
      and(
        eq(bodyLogs.userId, userId),
      ),
    )
    .orderBy(desc(bodyLogs.logDate));
};

export const getInjectionLogs = async ({
  userId,
}: {
  userId: string;
}) => {
  return db
    .select()
    .from(injectionLogs)
    .where(
      and(
        eq(injectionLogs.userId, userId),
      ),
    )
    .orderBy(desc(injectionLogs.logDate));
};

export const getLastInjectionDate = async ({ userId }: { userId: string }) => {
  const result = await db
    .select()
    .from(injectionLogs)
    .where(eq(injectionLogs.userId, userId))
    .orderBy(desc(injectionLogs.logDate))
    .limit(1);
  return result[0]?.logDate || null;
};

export const upsertBodyLog = async (data: BodyLogFormType) => {
  return db
    .insert(bodyLogs)
    .values({
      userId: data.userId,
      logDate: data.logDate, // yyyy-mm-dd
      weight: data.weight != null ? data.weight.toString() : null,
      bodyFatRate:
        data.bodyFatRate != null ? data.bodyFatRate.toString() : null,
      muscleMass:
        data.muscleMass != null ? data.muscleMass.toString() : null,
    })
    .onConflictDoUpdate({
      target: [bodyLogs.userId, bodyLogs.logDate],
      set: {
        weight: data.weight != null ? data.weight.toString() : null,
        bodyFatRate:
          data.bodyFatRate != null ? data.bodyFatRate.toString() : null,
        muscleMass:
          data.muscleMass != null ? data.muscleMass.toString() : null,
        updatedAt: new Date(),
      },
    })
    .returning();
};

export const upsertInjectionLog = async (data: {
  userId: string;
  logDate: string;
  drugType: "MOUNJARO" | "WEGOVY";
  dosage: string | null;
  note: string | null;
}) => {
  return db
    .insert(injectionLogs)
    .values({
      userId: data.userId,
      logDate: data.logDate,
      drugType: data.drugType,
      dosage: data.dosage,
      note: data.note,
    })
    .onConflictDoUpdate({
      target: [injectionLogs.userId, injectionLogs.logDate],
      set: {
        drugType: data.drugType,
        dosage: data.dosage,
        note: data.note,
        updatedAt: new Date(),
      },
    })
    .returning();
}