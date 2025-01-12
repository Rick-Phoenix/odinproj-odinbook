import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { api } from "../lib/api-client";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.protected.home.$get();
      if (!response.ok) {
        throw new Error("Oh my!");
      }
      return await response.json();
    },
  });
  return (
    <div className="p-2">
      {isPending ? <h3>Log in to access</h3> : <h3>{data}</h3>}
    </div>
  );
}
