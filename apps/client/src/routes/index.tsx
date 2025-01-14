import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "../hooks/auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const user = useUser();

  return user === null ? (
    <div>Logged out</div>
  ) : (
    <div className="p-2">{user?.username}</div>
  );
}
