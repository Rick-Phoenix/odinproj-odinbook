import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export const Route = createFileRoute("/_auth/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Link
          to={"/post"}
          className="flex flex-col justify-end aspect-video rounded-xl bg-muted/50"
        >
          {/* <div className="aspect-video rounded-xl bg-muted/50">opst 1</div> */}

          <CardContent>Blah</CardContent>
          <CardHeader>
            <CardTitle>Post 1</CardTitle>
            <CardDescription>Post description</CardDescription>
          </CardHeader>
        </Link>
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </main>
  );
}
