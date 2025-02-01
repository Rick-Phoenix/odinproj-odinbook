import { schemas } from "@nexus/shared-schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { title } from "radashi";
import { useEffect, useRef, type FC } from "react";
import { StaticInset } from "../../../components/custom/sidebar-wrapper";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { api, type Chat, type Message } from "../../../lib/api-client";
import { chatsQueryOptions } from "../../../main";
import { singleErrorsAdapter } from "../../../utils/form-utils";
import { errorTypeGuard } from "../../../utils/type-guards";

export const Route = createFileRoute("/_app/chats/$chatId")({
  component: RouteComponent,
  params: {
    parse: ({ chatId }) => {
      return { chatId: +chatId };
    },
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.fetchQuery(chatsQueryOptions);
  },
});

function RouteComponent() {
  const { chatId } = Route.useParams();
  const { data: chat } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const res = await api.chats[":chatId"].$get({ param: { chatId } });
      if (!res.ok) throw Error("Server Error");
      const data = await res.json();
      return data;
    },
    gcTime: Infinity,
    staleTime: Infinity,
  });
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
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      text: "",
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        try {
          await handleSendMessage.mutateAsync(value.text);
          return null;
        } catch (error) {
          if (errorTypeGuard(error)) return error.message;
        }
      },
      onSubmit: schemas.insertMessageSchema,
    },
    validatorAdapter: singleErrorsAdapter,
    onSubmit(props) {},
  });

  const handleSendMessage = useMutation({
    mutationKey: ["chat", chatId],
    mutationFn: async (text: string) => {
      const res = await api.chats[":chatId"].$post({
        param: { chatId },
        json: { text },
      });
      const resData = await res.json();
      if ("issues" in resData) {
        throw new Error(resData.issues[0].message);
      }
      return resData;
    },
    onSuccess(data, variables, context) {
      queryClient.setQueryData(["chat", chatId], (old: Chat) => {
        return { ...old, messages: [...old.messages, data] };
      });
      form.reset();
      scrollToBottom();
    },
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef !== null && scrollAreaRef.current !== null) {
      setTimeout(() => {
        const scrollArea = scrollAreaRef.current!;
        scrollArea.scroll({ behavior: "smooth", top: scrollArea.scrollHeight });
      }, 0);
    }
  };

  useEffect(() => {
    const scrollArea = scrollAreaRef.current!;
    scrollArea.scroll({ behavior: "instant", top: scrollArea.scrollHeight });
  }, []);

  return (
    <StaticInset>
      <section className="flex h-full flex-col justify-between rounded-xl bg-muted/50">
        <div className="flex h-28 w-full items-center justify-between rounded-xl rounded-b-none bg-muted p-8 hover:bg-muted-foreground/30 hover:text-foreground">
          <Avatar>
            <AvatarImage
              src={contactAvatar}
              alt={`${contactName} profile picture`}
            />
          </Avatar>
          <div className="text-lg font-semibold">{title(contactName)}</div>
        </div>

        <ScrollArea className="h-full w-full" viewportRef={scrollAreaRef}>
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
