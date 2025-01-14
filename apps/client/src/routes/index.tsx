import {
  createFileRoute,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { useFetchUser } from "../hooks/auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const user = useFetchUser();
  console.log("🚀 ~ Index ~ user:", user);
  return user === null ? (
    <div>Logged out</div>
  ) : (
    <div className="p-2">{user?.username}</div>
  );
}
