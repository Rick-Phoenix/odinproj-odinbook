import { type SQL, sql } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

export function lowercase(column: AnyPgColumn | SQL): SQL {
  return sql`lower(${column})`;
}

export function trim(column: AnyPgColumn): SQL {
  return sql`trim(${column})`;
}
