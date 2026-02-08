export type LogType = "weight" | "injection";

export type InjectionLog = {
    id: string;
    userId: string;
    logDate: string;
    drugType: "MOUNJARO" | "WEGOVY" | null;
    dosage: number | null;
    note: string | null;
    createdAt: string;
    updatedAt: string;
}

export type BodyLog = {
    id: string;
    userId: string;
    logDate: string;
    weight: number | null;
    bodyFatRate: number | null;
    muscleMass: number | null;
    createdAt: string;
    updatedAt: string;
}

export type DailyLog = {
    date: string;
    body: BodyLog | null;
    injection: InjectionLog | null;
}

export type WeekCache = {
  [weekStart: string]: {
    [date: string]: DailyLog;
  };
};

export type Party = {
  id: string;
  name: string;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  memberCount: number;
}

export type PartyDetail = Omit<Party, "memberCount"> & {
  members: {
    userId: string;
    joinedAt: string;
    user: {
      id: string;
      name: string;
    }
  }[];
};