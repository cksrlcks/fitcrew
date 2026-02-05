import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./users";
import { relations } from "drizzle-orm";

export const parties = pgTable("parties", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  inviteCode: text("invite_code").notNull().unique(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "set null" }),
});

export const partyMembers = pgTable(
  "party_members",
  {
    partyId: uuid("party_id")
      .notNull()
      .references(() => parties.id, { onDelete: "cascade" }),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.partyId, table.userId] }),
    };
  },
);

export const partiesRelations = relations(parties, ({ many }) => ({
  members: many(partyMembers),
}));

export const partyMembersRelations = relations(partyMembers, ({ one }) => ({
  party: one(parties, {
    fields: [partyMembers.partyId],
    references: [parties.id],
  }),
  user: one(user, {
    fields: [partyMembers.userId],
    references: [user.id],
  }),
}));
