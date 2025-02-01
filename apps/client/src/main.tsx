// The vite plugin works but it causes issues with TS
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "vite/modulepreload-polyfill";

import "./styles/index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { useUser } from "./hooks/auth";
import { api, wsRPC } from "./lib/api-client";
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

queryClient.setQueryDefaults(["chat"], {
  gcTime: Infinity,
  staleTime: Infinity,
});

export const chatsQueryOptions = {
  queryKey: ["chats"],
  queryFn: async () => {
    const res = await api.chats.$get();
    if (!res.ok) throw Error("Server Error");
    const chats = await res.json();
    const user = await api.users.user.$get();
    const user2 = await user.json();
    for (const chat of chats) {
      queryClient.setQueryData(["chat", chat.id], chat);
      const webSocket = wsRPC.ws[":chatId"].$ws({
        param: { chatId: chat.id.toString() },
      });
      webSocket.addEventListener("open", (e) => {
        const msg = `Hello from ${user2?.username}`;
        setInterval(() => {
          webSocket.send(msg);
          console.log(`Sent message: ${msg}`);
        }, 5000);
      });

      webSocket.addEventListener("message", (e) => {
        console.log(`Received message: ${e.data}`);
      });
    }
    return chats;
  },
  gcTime: Infinity,
  staleTime: Infinity,
};

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
        <App />
        {/* </ThemeProvider> */}
      </QueryClientProvider>
    </StrictMode>,
  );
}
