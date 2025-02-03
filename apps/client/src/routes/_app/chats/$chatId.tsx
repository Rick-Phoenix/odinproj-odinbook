import { schemas } from "@nexus/shared-schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { title } from "radashi";
import { useEffect, useRef, type FC } from "react";
import { StaticInset } from "../../../components/custom/sidebar-wrapper";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { type ChatContent, type Message } from "../../../lib/api-client";
import { chatsQueryOptions } from "../../../main";
import { singleErrorsAdapter } from "../../../utils/form-utils";
import { errorTypeGuard } from "../../../utils/type-guards";

export interface Chat {
  content: ChatContent;
  webSocket: WebSocket;
}

export const Route = createFileRoute("/_app/chats/$chatId")({
  component: RouteComponent,
  params: {
    parse: ({ chatId }) => {
      return { chatId: +chatId };
    },
  },
  loader: async ({ context: { queryClient }, params: { chatId } }) => {
    await queryClient.fetchQuery(chatsQueryOptions);
    const chat: Chat | undefined = queryClient.getQueryData(["chat", chatId]);
    if (!chat) throw new Error("Chat not found");
  },
});

function RouteComponent() {
  const { chatId } = Route.useParams();
  const {
    data: { content: chat },
  } = useSuspenseQuery<Chat>({ queryKey: ["chat", chatId] });
  return (
    <>
      {chat && (
        <Chat
          contactName={chat.contact.username}
          contactAvatar={chat.contact.avatarUrl}
          contactId={chat.contact.id}
          messages={chat.messages}
          chatId={chat.id}
        />
      )}
    </>
  );
}

const Chat: FC<{
  contactAvatar: string;
  contactName: string;
  messages: Message[];
  contactId: string;
  chatId: number;
}> = ({ contactAvatar, contactName, messages, contactId, chatId }) => {
  const { data: chat } = useSuspenseQuery<Chat>({ queryKey: ["chat", chatId] });
  const form = useForm({
    defaultValues: {
      text: "",
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        try {
          await handleSendMessage.mutateAsync({ text: value.text });
          return null;
        } catch (error) {
          if (errorTypeGuard(error)) return error.message;
        }
      },
      onSubmit: schemas.insertMessageSchema,
    },
    validatorAdapter: singleErrorsAdapter,
    onSubmit() {
      form.reset();
    },
  });

  const handleSendMessage = useMutation<unknown, unknown, { text: string }>({
    mutationKey: ["chat", chatId],
  });

  const viewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (viewportRef !== null && viewportRef.current !== null) {
      const scrollArea = viewportRef.current!;
      scrollArea.scroll({ behavior: "smooth", top: scrollArea.scrollHeight });
    }
  }, [chat]);

  useEffect(() => {
    const scrollArea = viewportRef.current!;
    scrollArea.scroll({ behavior: "instant", top: scrollArea.scrollHeight });
    inputRef.current!.focus();
  }, []);

  return (
    <StaticInset>
      <section className="flex h-full flex-col justify-between rounded-xl bg-muted/50">
        <Link
          to="/users/$username"
          params={{ username: chat.content.contact.username }}
          className="flex h-28 w-full items-center justify-between rounded-xl rounded-b-none bg-muted p-8 hover:bg-muted-foreground/30 hover:text-foreground"
        >
          <Avatar>
            <AvatarImage
              src={contactAvatar}
              alt={`${contactName} profile picture`}
            />
          </Avatar>
          <div className="text-lg font-semibold">{title(contactName)}</div>
        </Link>

        <ScrollArea className="h-full w-full" viewportRef={viewportRef}>
          <div className="grid w-full gap-8 rounded-xl p-8">
            {messages.map((message, i, a) => {
              const isFromUser = message.userId !== contactId;
              return (
                <Message
                  key={message.id}
                  isFromUser={isFromUser}
                  text={message.text}
                  createdAt={message.createdAt}
                />
              );
            })}
          </div>
        </ScrollArea>

        <form
          className="flex items-center"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="text"
            children={(field) => (
              <>
                <Input
                  className="textm-md rounded-l-xl rounded-r-none border-r-0 p-8"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Write a message..."
                  ref={inputRef}
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
                variant={"ghost"}
                className="aspect-square h-full rounded-l-none rounded-r-xl border border-l-0 hover:bg-muted-foreground/30 focus:bg-muted-foreground/30"
              >
                <Send />
              </Button>
            )}
          />
        </form>
      </section>
    </StaticInset>
  );
};

const Message: FC<{
  text: string;
  createdAt: string;
  isFromUser: boolean;
}> = ({ text, createdAt, isFromUser }) => {
  const sentAt = new Date(createdAt);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const sentBeforeToday = sentAt < now;
  const conditionalClasses = isFromUser
    ? "message-user rounded-tr-none justify-self-end text-end"
    : "message-contact rounded-tl-none";
  const className = `${conditionalClasses} relative flex max-h-max w-fit items-end rounded-2xl bg-muted-foreground/30 p-3`;
  return (
    <div className={className}>
      <div className="flex flex-col gap-1">
        <div>{text}</div>
        <span className="text-sm text-muted-foreground">
          {sentBeforeToday
            ? format(sentAt, "MMM do '|' H:mm")
            : format(sentAt, "H:mm")}
        </span>
      </div>
    </div>
  );
};
