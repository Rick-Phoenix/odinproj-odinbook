import { useForm } from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { SquarePen } from "lucide-react";
import type { FC, ReactNode } from "react";
import { z } from "zod";
import { InsetScrollArea } from "../../../components/custom/sidebar-wrapper";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { api, type ChatContent } from "../../../lib/api-client";
import { cacheChat, chatsQueryOptions } from "../../../main";
import { errorTypeGuard } from "../../../utils/type-guards";
import type { Chat } from "./$chatId";

export const Route = createFileRoute("/_app/chats/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.fetchQuery(chatsQueryOptions);
  },
});

const ChatDialog: FC<{ children: ReactNode }> = ({ children }) => {
  const form = useForm({
    defaultValues: {
      contactUsername: "",
    },
    validators: {
      onSubmitAsync: async ({ value: { contactUsername } }) => {
        try {
          await createChat.mutateAsync({ contactUsername });
          return null;
        } catch (error) {
          if (errorTypeGuard(error)) return error.message;
        }
      },
      onSubmit: z.object({ contactUsername: z.string() }),
    },
    onSubmit() {
      form.reset();
    },
  });

  const queryClient = useQueryClient();
  const nav = useNavigate();

  const createChat = useMutation({
    mutationKey: ["chat"],
    mutationFn: async (v: { contactUsername: string }) => {
      const { contactUsername } = v;
      const chat = queryClient
        .getQueryData<ChatContent[]>(["chats"])!
        .find((chat) => chat.contact.username === contactUsername);
      if (chat)
        redirect({
          to: "/chats/$chatId",
          params: { chatId: chat.id },
        });
      const res = await api.chats.$post({ json: { contactUsername } });
      const data = await res.json();
      if ("issues" in data) {
        throw new Error(data.issues[0].message);
      }
      return data;
    },
    onSuccess(data) {
      queryClient.setQueryData(["chats"], (old: Chat[]) => [...old, data]);
      cacheChat(data);
      nav({ to: "/chats/$chatId", params: { chatId: data.id } });
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Create Chat</DialogTitle>
          <form
            className="flex items-center"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="contactUsername"
              children={(field) => (
                <>
                  <Label htmlFor="contactUsername">Contact Username:</Label>
                  <Input
                    name="contactUsername"
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  />
                </>
              )}
            ></form.Field>
            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.isTouched,
              ]}
              children={([canSubmit, isSubmitting, isTouched]) => (
                <Button
                  type="submit"
                  aria-disabled={!canSubmit || isSubmitting || !isTouched}
                  disabled={!canSubmit || isSubmitting || !isTouched}
                >
                  Create Chat
                </Button>
              )}
            />
            <form.Subscribe
              selector={(state) => [state.errorMap]}
              children={([errorMap]) =>
                errorMap.onSubmit ? (
                  <div>
                    <em>{errorMap.onSubmit?.toString()}</em>
                  </div>
                ) : null
              }
            />
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

function RouteComponent() {
  const { data: chats } = useSuspenseQuery(chatsQueryOptions);
  return (
    <InsetScrollArea>
      <section className="grid min-h-[75vh] max-w-full flex-1 grid-cols-1 grid-rows-6 gap-4 rounded-xl bg-muted/50 p-4">
        <header className="flex h-28 w-full items-center justify-between rounded-xl bg-muted-foreground/30 p-8 hover:text-foreground">
          <h2 className="text-3xl font-semibold">Chats</h2>
          <ChatDialog>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="p-6 [&_svg]:size-10"
              title="New Chat"
            >
              <SquarePen />
            </Button>
          </ChatDialog>
        </header>
        {chats.length &&
          chats.map((chat) => (
            <ChatPreview
              key={chat.id}
              contactName={chat.contact.username}
              contactAvatar={chat.contact.avatarUrl}
              lastMessage={chat.messages.at(-1)?.text}
              chatId={chat.id}
            />
          ))}
      </section>
    </InsetScrollArea>
  );
}

const ChatPreview: FC<{
  contactName: string;
  contactAvatar: string;
  lastMessage: string | undefined;
  chatId: number;
}> = ({ contactName, contactAvatar, lastMessage, chatId }) => {
  return (
    <Link
      to={"/chats/$chatId"}
      params={{ chatId }}
      className="flex h-28 w-full items-center justify-between gap-8 rounded-xl bg-muted p-8 hover:bg-muted-foreground/30 hover:text-foreground"
    >
      <Avatar className="h-full w-auto">
        <AvatarImage
          src={contactAvatar}
          alt={`${contactName} profile picture`}
        />
      </Avatar>
      <div className="flex w-1/2 flex-col items-end gap-3">
        <div className="text-lg font-semibold">{contactName}</div>
        <div className="line-clamp-1 text-end font-semibold text-muted-foreground">
          {lastMessage}
        </div>
      </div>
    </Link>
  );
};
