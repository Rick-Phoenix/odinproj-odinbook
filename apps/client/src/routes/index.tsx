import { userQueryOptions } from "@/lib/queryOptions";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions);
    if (user) {
      throw redirect({
        to: "/rooms",
        search: { orderBy: "likesCount" },
      });
    }
  },
  component: Index,
});

function Index() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Link to={"/"}>
          <div className="aspect-video rounded-xl bg-muted/50">Post 1</div>
        </Link>
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </main>
  );
}
