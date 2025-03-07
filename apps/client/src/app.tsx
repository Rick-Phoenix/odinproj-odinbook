import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { useSuspenseUser } from "./hooks/auth";
import { queryClient } from "./lib/queries/queryClient";
import { router } from "./lib/router/routerProvider";
import "./styles/index.css";

function InnerApp() {
  const user = useSuspenseUser();
  return <RouterProvider router={router} context={{ user }} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InnerApp />
    </QueryClientProvider>
  );
}
