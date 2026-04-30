import { mysqlTable, serial, varchar, timestamp, text, mysqlEnum, int } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const todos = mysqlTable("todos", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").default(''),
  urgency: mysqlEnum("urgency", ["LOW", "MEDIUM", "HIGH"]).default("LOW").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});