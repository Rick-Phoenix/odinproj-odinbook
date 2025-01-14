import type { User } from "@nexus/shared-schemas";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, use, useState, type ReactNode } from "react";
import { api } from "../lib/api-client";

export function useFetchUser() {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.protected.user.$get();
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
  });
  console.log("🚀 ~ useFetchUser ~ query:", query);
  const user = query.data;

  return user;
}

// Context based auth: not necessary at the moment

export const UserContext = createContext<User | null | undefined>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const user = useFetchUser();
  console.log("🚀 ~ UserProvider ~ user:", user);

  return <UserContext value={user}>{children}</UserContext>;
}
