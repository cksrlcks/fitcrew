import {
  pgTable,
  uuid,
  date,
  numeric,
  timestamp,
  uniqueIndex,
  pgEnum,
  text
} from "drizzle-orm/pg-core";
import { user } from "./users";

export const drugTypeEnum = pgEnum("drug_type", ["MOUNJARO", "WEGOVY"]);

export const injectionLogs = pgTable(
  "injection_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    logDate: date("log_date").notNull(),

    drugType: drugTypeEnum("drug_type"),
    dosage: numeric("dosage", { precision: 5, scale: 2 }),

    note: text("note"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("injection_logs_user_date_idx").on(t.userId, t.logDate)],
);
