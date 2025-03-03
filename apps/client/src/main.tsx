// The vite plugin works but it causes issues with TS
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "vite/modulepreload-polyfill";

import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
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

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
