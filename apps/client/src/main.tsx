// The vite plugin works but it causes issues with TS
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "vite/modulepreload-polyfill";

import "./styles/index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode, use } from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { useFetchUser, UserContext, UserProvider } from "./hooks/auth";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: {} },
});

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    user: undefined!,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  // defaultErrorComponent: DefaultCatchBoundary,
  //     defaultNotFoundComponent: () => <NotFound />,
});

// function App() {
//   const user = useFetchUser();
//   console.log("🚀 ~ App ~ user:", user);
//   return <RouterProvider router={router} context={{ user }} />;
// }

function App() {
  const user = useFetchUser();
  console.log("🚀 ~ App ~ user:", user);
  return (
    <UserProvider>
      <InnerApp />
    </UserProvider>
  );
}

function InnerApp() {
  const user = use(UserContext);
  console.log("🚀 ~ App ~ user:", user);
  return <RouterProvider router={router} context={{ user }} />;
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  );
}
