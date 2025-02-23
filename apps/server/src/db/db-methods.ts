import {
  getTableColumns,
  getTableName,
  sql,
  type AnyColumn,
  type ChangeColumnTableName,
  type SQL,
  type Subquery,
  type Table,
} from "drizzle-orm";
import { PgDialect, type AnyPgColumn, type PgColumn, type PgTable } from "drizzle-orm/pg-core";

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
  const sqlChunks = sql`
    (
      SELECT
        COUNT(*)
      FROM
        ${refId.table}
      WHERE
        ${refId} = ${fieldId}
    )
  `;
  const rawSQL = sql.raw(pgDialect.sqlToQuery(sqlChunks).sql);

  return {
    [name]: rawSQL.mapWith(Number).as(name),
  } as { [Key in T]: SQL.Aliased<number> };
};

export function withCTEColumns<
  TTable extends Table,
  TCte extends Subquery & { [K in keyof TTable["_"]["columns"]]: PgColumn },
>(table: TTable, cte: TCte) {
  type ColumnKeys = keyof TTable["_"]["columns"];

  return Object.keys(getTableColumns(table)).reduce(
    (acc, columnName) => {
      const key = columnName as ColumnKeys;
      acc[key] = cte[key];
      return acc;
    },
    {} as { [K in ColumnKeys]: TCte[K] }
  );
}

type ColumnAlias<T extends AnyColumn> = ChangeColumnTableName<T, string, "pg">;

type ColumnAliases<T extends PgTable> = {
  [K in keyof T["_"]["columns"]]: ColumnAlias<T["_"]["columns"][K]>;
};

export function getTableColumnAliases<T extends PgTable>(
  table: T,
  keysToAlias: (keyof T["_"]["columns"])[]
): ColumnAliases<T> {
  const name = getTableName(table);
  return Object.fromEntries(
    Object.entries(getTableColumns(table)).map(([key, column]) => {
      if (!keysToAlias.includes(key as keyof T["_"]["columns"])) {
        return [key, column];
      }
      return [
        key,
        sql<number>`${table}.${sql.identifier(key)}`
          // eslint-disable-next-line @typescript-eslint/unbound-method
          .mapWith(column.mapFromDriverValue)
          .as(`${name}_${key}`),
      ];
    })
  ) as unknown as ColumnAliases<T>;
}
