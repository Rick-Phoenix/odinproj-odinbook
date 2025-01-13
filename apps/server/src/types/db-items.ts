import type { InferSelectModel } from "drizzle-orm";
import { sessionTable, userTable } from "../db/schema";

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
