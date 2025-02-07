import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { api } from "../lib/api-client";
import { userQueryOptions } from "../lib/queryOptions";

export function useUser() {
  const query = useQuery(userQueryOptions);
  const user = query.data;

  return user;
}
export function useSuspenseUser() {
  const query = useSuspenseQuery(userQueryOptions);
  const user = query.data;

  return user;
}

export async function handleLogout() {
  await api.auth.logout.$post();
  location.href = "/";
}

export function handleGithubLogin() {
  location.href = "/api/auth/github";
}
