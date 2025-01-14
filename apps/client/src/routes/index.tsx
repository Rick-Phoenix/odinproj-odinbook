import { createFileRoute } from "@tanstack/react-router";
import { useFetchUser } from "../hooks/auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const user = useFetchUser();

  return user === null ? (
    <div>Logged out</div>
  ) : (
    <div className="p-2">{user?.username}</div>
  );
}
