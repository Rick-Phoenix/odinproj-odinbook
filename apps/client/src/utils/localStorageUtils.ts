export function getLocalStorageBoolean(key: string) {
  const value = localStorage.getItem(key);
  return value === "false" ? false : value === "true" ? true : null;
}

export function parseLocalStorage<T extends string>(key: string, values: readonly T[]): T | null {
  const value = localStorage.getItem(key);

  if (value === null) return null;

  if (values.includes(value as any)) {
    return value as T;
  }

  return null;
}
