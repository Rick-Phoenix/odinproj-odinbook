import type { InferSelectModel } from "drizzle-orm";
import type { sessionTable, userTable } from "../db/schema";

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;

export namespace dbtypes {
  export type User = InferSelectModel<typeof userTable>;
  export type Session = InferSelectModel<typeof sessionTable>;
}
