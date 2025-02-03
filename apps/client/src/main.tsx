// The vite plugin works but it causes issues with TS
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "vite/modulepreload-polyfill";

import "./styles/index.css";

import {
  QueryClient,
  QueryClientProvider,
  queryOptions,
} from "@tanstack/react-query";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      staleTime: Infinity,
    },
  },
});

export const roomQueryOptions = (roomName: string) =>
  queryOptions({
    queryKey: ["room", roomName],
    queryFn: async () => {
      const res = await api.rooms[":roomName"].$get({ param: { roomName } });
      const data = await res.json();
      if ("issues" in data) {
        throw new Error("Room not found.");
      }
      return data;
    },
  });

function createWebSocket(chatId: number) {
  const webSocket = wsRPC.ws[":chatId"].$ws({
    param: { chatId: chatId.toString() },
  });

  webSocket.addEventListener("message", () => {
    queryClient.invalidateQueries({
      queryKey: ["chat", chatId],
      exact: true,
    });
  });

  return webSocket;
}

export function cacheChat(chat: ChatContent) {
  const webSocket = createWebSocket(chat.id);

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
    if (data.length > 0)
      for (const chat of data) {
        cacheChat(chat);
      }
    return data;
  },
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
