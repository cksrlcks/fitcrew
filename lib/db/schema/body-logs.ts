import {
  pgTable,
  uuid,
  date,
  numeric,
  timestamp,
  uniqueIndex,
  text
} from "drizzle-orm/pg-core";

import { user } from "./users";

export const bodyLogs = pgTable(
  "body_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    logDate: date("log_date").notNull(),

    weight: numeric("weight", { precision: 5, scale: 2 }),
    bodyFatRate: numeric("body_fat_rate", { precision: 5, scale: 2 }),
    muscleMass: numeric("muscle_mass", { precision: 5, scale: 2 }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("body_logs_user_date_idx").on(t.userId, t.logDate)],
);
