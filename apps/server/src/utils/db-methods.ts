import { sql, type SQL } from "drizzle-orm";
import {
  PgDialect,
  type AnyPgColumn,
  type PgColumn,
} from "drizzle-orm/pg-core";

export function lowercase(column: AnyPgColumn | SQL): SQL {
  return sql`lower(${column})`;
}

export function trim(column: AnyPgColumn): SQL {
  return sql`trim(${column})`;
}

export function entryExists(entry: unknown[]) {
  return entry.length > 0;
}

const pgDialect = new PgDialect();
export const countRelation = <const T extends string>(
  name: T,
  fieldId: PgColumn,
  refId: PgColumn
): { [Key in T]: SQL.Aliased<number> } => {
  const sqlChunks = sql`(SELECT COUNT(*) FROM ${refId.table} WHERE ${refId} = ${fieldId})`;
  const rawSQL = sql.raw(pgDialect.sqlToQuery(sqlChunks).sql);

  return {
    [name]: rawSQL.mapWith(Number).as(name),
  } as { [Key in T]: SQL.Aliased<number> };
};

export function isLiked(userId: string, postId: PgColumn) {
  return {
    isLiked: sql<boolean>`
    EXISTS (
      SELECT 1 FROM likes 
      WHERE likes."postId" = ${postId} 
      AND likes."userId" = ${userId}
    )
  `.as("isLiked"),
  };
}

export function isSubscribed(userId: string, roomName: PgColumn) {
  return {
    isSubscribed: sql<boolean>`
    EXISTS (
      SELECT 1 FROM "subs" 
      WHERE "subs"."room" = ${roomName}
      AND "subs"."userId" = ${userId}
    )
  `.as("isSubscribed"),
  };
}
