import { db } from "..";
import { eq, and, count, sql, asc, inArray } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { partyMembers } from "../schema/parties";
import { parties } from "../schema/parties";
import { user } from "../schema/users";
import { alias } from "drizzle-orm/pg-core";
import { formatISO, subDays } from "date-fns";
import { bodyLogs } from "../schema";
import { formatInTimeZone } from "date-fns-tz";

const generateInviteCode = customAlphabet(
  "23456789ABCDEFGHJKLMNPQRSTUVWXYZ",
  8,
);

const pmMe = alias(partyMembers, "pmMe");
const pmAll = alias(partyMembers, "pmAll");

export const getMyParties = async (userId: string) => {
  return await db
    .select({
      id: parties.id,
      name: parties.name,
      inviteCode: parties.inviteCode,
      createdAt: parties.createdAt,
      ownerId: parties.ownerId,
      memberCount: count(pmAll.userId).as("memberCount"),
    })
    .from(pmMe)
    .innerJoin(parties, eq(pmMe.partyId, parties.id))
    .innerJoin(pmAll, eq(pmAll.partyId, parties.id))
    .where(eq(pmMe.userId, userId))
    .groupBy(
      parties.id,
      parties.name,
      parties.inviteCode,
      parties.createdAt,
      parties.ownerId,
    );
};

export const createParty = async (name: string, ownerId: string) => {
  return await db.transaction(async (tx) => {
    const [newParty] = await tx
      .insert(parties)
      .values({
        name,
        ownerId,
        inviteCode: generateInviteCode(),
      })
      .returning();

    await tx.insert(partyMembers).values({
      partyId: newParty.id,
      userId: ownerId,
    });

    return newParty;
  });
};

export const getPartyDetail = async (partyId: string, userId: string) => {
  const rows = await db
    .select({
      party: parties,
      member: {
        userId: partyMembers.userId,
        joinedAt: partyMembers.joinedAt,
      },
      user: {
        id: user.id,
        name: user.name,
      },
    })
    .from(parties)
    .leftJoin(partyMembers, eq(parties.id, partyMembers.partyId))
    .leftJoin(user, eq(partyMembers.userId, user.id))
    .where(eq(parties.id, partyId));

  if (rows.length === 0) return null;

  const partyInfo = rows[0].party;
  const members = rows
    .filter((r) => r.member?.userId !== null)
    .map((r) => ({
      ...r.member,
      user: r.user,
    }));

  const isMember = members.some((m) => m.userId === userId);
  if (!isMember) {
    throw new Error("파티 멤버가 아닙니다.");
  }

  return { ...partyInfo, members };
};

export const joinPartyByCode = async (inviteCode: string, userId: string) => {
  const [party] = await db
    .select()
    .from(parties)
    .where(eq(parties.inviteCode, inviteCode.toUpperCase()));

  if (!party) throw new Error("유효하지 않은 초대 코드입니다.");

  await db.insert(partyMembers).values({
    partyId: party.id,
    userId: userId,
  });

  return party;
};

export const leaveParty = async (partyId: string, userId: string) => {
  const [party] = await db
    .select({ ownerId: parties.ownerId })
    .from(parties)
    .where(eq(parties.id, partyId));

  if (party?.ownerId === userId) {
    throw new Error("방장은 탈퇴할 수 없습니다.");
  }

  return await db
    .delete(partyMembers)
    .where(
      and(eq(partyMembers.partyId, partyId), eq(partyMembers.userId, userId)),
    );
};

export const deleteParty = async (partyId: string, userId: string) => {
  const [party] = await db
    .select({ ownerId: parties.ownerId })
    .from(parties)
    .where(eq(parties.id, partyId));

  if (!party || party.ownerId !== userId) {
    throw new Error("삭제 권한이 없습니다.");
  }

  return await db.delete(parties).where(eq(parties.id, partyId));
};

export const updateParty = async (
  partyId: string,
  userId: string,
  name: string,
) => {
  const [party] = await db
    .select({ ownerId: parties.ownerId })
    .from(parties)
    .where(eq(parties.id, partyId));

  if (!party) throw new Error("파티를 찾을 수 없습니다.");
  if (party.ownerId !== userId) throw new Error("수정 권한이 없습니다.");

  const [updatedParty] = await db
    .update(parties)
    .set({ name })
    .where(eq(parties.id, partyId))
    .returning();

  return updatedParty;
};

export const checkUserInParty = async (partyId: string, userId: string) => {
  const countResult = await db
    .select({ count: count() })
    .from(partyMembers)
    .where(
      and(eq(partyMembers.partyId, partyId), eq(partyMembers.userId, userId)),
    );
  return countResult[0].count > 0;
};

export const getPartySummary = async (partyId: string) => {
  const today = new Date();
  const todayStr = formatInTimeZone(today, "Asia/Seoul", "yyyy-MM-dd");

  const members = await db
    .select({
      userId: partyMembers.userId,
      name: user.name,
    })
    .from(partyMembers)
    .innerJoin(user, eq(partyMembers.userId, user.id))
    .where(eq(partyMembers.partyId, partyId));

  if (members.length === 0) {
    return {
      partyId,
      asOf: todayStr,
      members: [],
    };
  }

  const userIds = members.map((m) => m.userId);

  const logs = await db
    .select({
      userId: bodyLogs.userId,
      logDate: bodyLogs.logDate,
      weight: bodyLogs.weight,
    })
    .from(bodyLogs)
    .where(inArray(bodyLogs.userId, userIds))
    .orderBy(asc(bodyLogs.logDate));

  const logsByUser = new Map<string, Map<string, { weight: number | null }>>();

  for (const log of logs) {
    if (!logsByUser.has(log.userId)) {
      logsByUser.set(log.userId, new Map());
    }

    logsByUser.get(log.userId)!.set(log.logDate, {
      weight: log.weight != null ? Number(log.weight) : null,
    });
  }

  const result = members.map((member) => {
    const userLogMap = logsByUser.get(member.userId) ?? new Map();
    const allDates = [...userLogMap.keys()].sort();

    const startDate = allDates[0];
    const endDate = allDates[allDates.length - 1];

    const startWeight =
      startDate != null
        ? userLogMap.get(startDate)?.weight ?? null
        : null;

    const currentWeight =
      endDate != null
        ? userLogMap.get(endDate)?.weight ?? null
        : null;

    const totalChange =
      startWeight != null && currentWeight != null
        ? Number((currentWeight - startWeight).toFixed(2))
        : null;

    const lossRate =
      startWeight != null && currentWeight != null
        ? Number(
            (((startWeight - currentWeight) / startWeight) * 100).toFixed(2),
          )
        : null;

    const recent7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(today, 6 - i);
      const dateStr = formatInTimeZone(d, "Asia/Seoul", "yyyy-MM-dd");

      return {
        date: dateStr,
        weight: userLogMap.get(dateStr)?.weight ?? null,
      };
    });

      const hasAnyRecord = recent7Days.some(
      (d) => d.weight != null,
    );

    let streakDays = 0;
    for (let i = recent7Days.length - 1; i >= 0; i--) {
      if (recent7Days[i].weight != null) {
        streakDays++;
      } else {
        break;
      }
    }

     return {
      userId: member.userId,
      name: member.name,

      recent7Days: {
        hasAnyRecord,
        days: recent7Days,
      },

      stats: {
        startWeight,
        currentWeight,
        totalChange,
        streakDays,
        lossRate,
      },
    };
  });

  return {
    partyId,
    asOf: todayStr,
    members: result,
  };
    
};
