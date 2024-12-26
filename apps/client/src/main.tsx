import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import SignUp from "./SignUp.tsx";
import Login from "./Login.1.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/signup",
    element: <SignUp />,
  },
  { path: "/login", element: <Login /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
