import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { api } from "../lib/api-client";

export const userQueryOptions = {
  queryKey: ["user"],
  queryFn: async () => {
    const res = await api.users.user.$get();
    if (res.status === 401) {
      return null;
    }
    if (!res.ok) {
      throw new Error("Server Error");
    }
    return await res.json();
  },
  staleTime: Infinity,
  gcTime: Infinity,
};

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
