import { sql, type SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

export function lowercase(column: AnyPgColumn): SQL {
  return sql`lower(${column})`;
}
