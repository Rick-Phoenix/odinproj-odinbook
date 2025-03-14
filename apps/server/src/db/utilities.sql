--ANCHOR - Triggers
CREATE OR REPLACE FUNCTION trigs () RETURNS TABLE (
  table_name TEXT,
  trigger_name TEXT,
  trigger_definition TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
  CAST(tgname AS TEXT) AS trigger_name, 
  CAST(relname AS TEXT) AS table_name, 
  CAST(pg_catalog.pg_get_triggerdef(pg_trigger.oid) AS TEXT) AS trigger_definition
FROM 
  pg_catalog.pg_trigger
  JOIN pg_catalog.pg_class ON pg_class.oid = pg_trigger.tgrelid
  WHERE NOT tgisinternal;  
  END
$$ LANGUAGE plpgsql;

--ANCHOR - Functions
CREATE OR REPLACE FUNCTION funcs () RETURNS TABLE (
  schema_name text,
  specific_name text,
  kind text,
  language text,
  definition text,
  arguments text,
  return_type text
) AS $$
BEGIN
    RETURN QUERY
    SELECT n.nspname::text as schema_name,
           p.proname::text as specific_name,
           CASE p.prokind 
                WHEN 'f' THEN 'FUNCTION'::text
                WHEN 'p' THEN 'PROCEDURE'::text
                WHEN 'a' THEN 'AGGREGATE'::text
                WHEN 'w' THEN 'WINDOW'::text
           END as kind,
           l.lanname::text as language,
           CASE WHEN l.lanname = 'internal' THEN p.prosrc::text
                ELSE pg_get_functiondef(p.oid)::text
           END as definition,
           pg_get_function_arguments(p.oid)::text as arguments,
           t.typname::text as return_type
    FROM pg_proc p
    LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
    LEFT JOIN pg_language l ON p.prolang = l.oid
    LEFT JOIN pg_type t ON t.oid = p.prorettype 
    WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
    ORDER BY schema_name, specific_name;
END;
$$ LANGUAGE plpgsql;
