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

export function isLiked(userId: string) {
  return {
    isLiked: sql<boolean>`
    EXISTS (
      SELECT 1 FROM likes 
      WHERE likes."postId" = posts.id 
      AND likes."userId" = ${userId}
    )
  `.as("isLiked"),
  };
}

export function isSubscribed(userId: string) {
  return {
    isSubscribed: sql<boolean>`
    EXISTS (
      SELECT 1 FROM "roomSubscriptions" 
      WHERE "roomSubscriptions"."roomId" = rooms.id 
      AND "roomSubscriptions"."userId" = ${userId}
    )
  `.as("isSubscribed"),
  };
}

export function createdByUser(userId: string, roomId: number) {
  return {
    createdByUser: sql<boolean>`
    EXISTS (
      SELECT 1 FROM "rooms" 
      WHERE rooms.id = ${roomId}
      AND rooms."creatorId"  = ${userId}
    )
  `.as("createdByUser"),
  };
}
