import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const tasks = sqliteTable("tasks", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  date: text("date"),
  isDaily: integer({ mode: "boolean" }).default(false), // Si se repite diariamente
});
