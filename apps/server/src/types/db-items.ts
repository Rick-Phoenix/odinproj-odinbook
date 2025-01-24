import type { InferSelectModel } from "drizzle-orm";
import { sessionsTable, usersTable } from "../db/schema";

export type User = InferSelectModel<typeof usersTable>;
export type Session = InferSelectModel<typeof sessionsTable>;
