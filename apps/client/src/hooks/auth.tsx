import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { api } from "../lib/api-client";

export const userQueryOptions = {
  queryKey: ["user"],
  queryFn: async () => {
    const res = await api.user.$get();
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

// Context based auth: not necessary at the moment

// export const UserContext = createContext<User | null | undefined>(null);

// export function UserProvider({ children }: { children: ReactNode }) {
//   const user = useFetchUser();
//   console.log("🚀 ~ UserProvider ~ user:", user);

//   return <UserContext value={user}>{children}</UserContext>;
// }

// Version with context

// function App() {
//   const user = useFetchUser();
//   console.log("🚀 ~ App ~ user:", user);
//   return (
//     <UserProvider>
//       <InnerApp />
//     </UserProvider>
//   );
// }

// function InnerApp() {
//   const user = use(UserContext);
//   console.log("🚀 ~ App ~ user:", user);
//   return <RouterProvider router={router} context={{ user }} />;
// }
