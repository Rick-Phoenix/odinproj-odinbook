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
import { api, wsRPC, type ChatContent } from "./lib/api-client";
import { routeTree } from "./routeTree.gen";

export type AppRouter = typeof router;
declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter;
  }
}

const queryClient = new QueryClient();

queryClient.setQueryDefaults(["chat"], {
  gcTime: Infinity,
  staleTime: Infinity,
});

function connectChat(chat: ChatContent) {
  const webSocket = wsRPC.ws[":chatId"].$ws({
    param: { chatId: chat.id.toString() },
  });

  webSocket.addEventListener("message", () => {
    queryClient.invalidateQueries({
      queryKey: ["chat", chat.id],
      exact: true,
    });
  });

  queryClient.setMutationDefaults(["chat", chat.id], {
    mutationFn: async ({ text }: { text: string }) => {
      const res = await api.chats[":chatId"].$post({
        param: { chatId: chat.id },
        json: { text },
      });
      const resData = await res.json();
      if ("issues" in resData) {
        throw new Error(resData.issues[0].message);
      }
      return;
    },
    onSuccess: () => {
      webSocket.send("Message Sent");
      queryClient.invalidateQueries({
        queryKey: ["chat", chat.id],
        exact: true,
      });
    },
  });

  queryClient.setQueryDefaults(["chat", chat.id], {
    gcTime: Infinity,
    staleTime: Infinity,
    queryFn: async () => {
      const res = await api.chats[":chatId"].$get({
        param: { chatId: chat.id },
      });
      const data = await res.json();
      if ("issues" in data) throw new Error("Chat not found.");
      return { content: data, webSocket };
    },
  });

  queryClient.setQueryData(["chat", chat.id], { content: chat, webSocket });
}

export const chatsQueryOptions = {
  queryKey: ["chats"],
  queryFn: async () => {
    const res = await api.chats.$get();
    const data = await res.json();
    if ("issues" in data) throw Error("Server Error");
    for (const chat of data) {
      connectChat(chat);
    }
    return data;
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
