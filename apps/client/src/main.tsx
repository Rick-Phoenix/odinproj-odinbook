// The vite plugin works but it causes issues with TS
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "vite/modulepreload-polyfill";

import "./styles/index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { useUser } from "./hooks/auth";
import { routeTree } from "./routeTree.gen";

export type AppRouter = typeof router;
declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter;
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

function App() {
  const user = useUser();
  return <RouterProvider router={router} context={{ user }} />;
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        {/* <ThemeProvider> */}
        <Suspense>
          <App />
        </Suspense>
        {/* </ThemeProvider> */}
      </QueryClientProvider>
    </StrictMode>
  );
}
