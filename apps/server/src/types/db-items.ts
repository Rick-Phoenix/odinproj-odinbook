import type { InferSelectModel } from "drizzle-orm";
import { sessions, users } from "../db/schema";

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
