import { schemas } from "@nexus/shared-schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { type FC, useEffect, useRef } from "react";
import StaticInset from "../../../components/custom/static-inset";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { chatMutationOptions, singleChatQueryOptions } from "../../../lib/queries/chatQueries";
import { singleErrorsAdapter } from "../../../utils/form-utils";
import { errorTypeGuard } from "../../../utils/type-guards";

export const Route = createFileRoute("/_app/chats/$chatId")({
  component: RouteComponent,
  params: {
    parse: ({ chatId }) => {
      return { chatId: +chatId };
    },
  },
  loader: async ({ context: { queryClient }, params: { chatId } }) => {
    try {
      return await queryClient.fetchQuery(singleChatQueryOptions(chatId));
    } catch (error) {
      throw notFound();
    }
  },
});

function RouteComponent() {
  const { chatId } = Route.useParams();
  const queryClient = useQueryClient();
  const { data: chat } = useSuspenseQuery(singleChatQueryOptions(chatId))!;
  const {
    messages,
    contact: { avatarUrl: contactAvatar, username: contactName, id: contactId },
  } = chat;
  const form = useForm({
    defaultValues: {
      text: "",
      receiverId: contactId,
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        try {
          await handleSendMessage.mutateAsync(value);
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

  const handleSendMessage = useMutation(chatMutationOptions(chatId));

  const viewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (viewportRef !== null && viewportRef.current !== null) {
      const scrollArea = viewportRef.current!;
      scrollArea.scroll({ behavior: "smooth", top: scrollArea.scrollHeight });
    }
    localStorage.setItem(`lastMessageRead-${chatId}`, messages.at(-1)?.id?.toString() || "");
    queryClient.setQueryData(["unreadMessages"], (old: number[] | undefined) =>
      old ? old.filter((id) => id !== chat.id) : undefined
    );
  }, [chat]);

  useEffect(() => {
    const scrollArea = viewportRef.current!;
    scrollArea.scroll({ behavior: "instant", top: scrollArea.scrollHeight });
    inputRef.current!.focus();
  }, [chatId]);

  return (
    <StaticInset>
      <section className="flex h-full flex-col justify-between rounded-xl bg-muted/50">
        {contactName !== "[deleted]" ? (
          <Link
            to="/users/$username"
            params={{ username: chat.contact.username }}
            className="flex h-28 w-full items-center justify-between rounded-xl rounded-b-none bg-muted p-8 hover:bg-muted-foreground/30 hover:text-foreground"
          >
            <Avatar>
              <AvatarImage src={contactAvatar} alt={`${contactName} profile picture`} />
            </Avatar>
            <div className="text-lg font-semibold">{contactName}</div>
          </Link>
        ) : (
          <div className="flex h-28 w-full items-center justify-between rounded-xl rounded-b-none bg-muted p-8 hover:bg-muted-foreground/30 hover:text-foreground">
            <Avatar>
              <AvatarImage src={contactAvatar} alt={`${contactName} profile picture`} />
            </Avatar>
            <div className="text-lg font-semibold italic text-muted-foreground">Deleted User</div>
          </div>
        )}

        <ScrollArea className="h-full w-full" viewportRef={viewportRef}>
          <div className="grid max-w-full gap-8 break-words rounded-xl p-8">
            {messages.map((message, i, a) => {
              const isFromUser = message.senderId !== contactId;
              return (
                <ChatMessage
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
                  className="text-md rounded-l-xl rounded-r-none border-r-0 p-8"
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
            selector={(state) => [state.canSubmit, state.isSubmitting, state.isTouched]}
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
}

const ChatMessage: FC<{
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
  const className = `${conditionalClasses} relative flex max-h-max w-fit max-w-full items-end rounded-2xl bg-muted-foreground/30 p-3`;
  return (
    <div className={className}>
      <div className="flex w-full flex-col gap-1 break-words">
        <span className="inline-block w-full break-words">{text}</span>
        <span className="text-sm text-muted-foreground">
          {sentBeforeToday ? format(sentAt, "MMM do '|' H:mm") : format(sentAt, "H:mm")}
        </span>
      </div>
    </div>
  );
};
