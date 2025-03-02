import { schemas } from "@nexus/shared-schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Send } from "lucide-react";
import { title } from "radashi";
import { useEffect, useRef } from "react";
import { z } from "zod";
import StaticInset from "../../../components/custom-ui-blocks/inset-area/StaticInset";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { api } from "../../../lib/api-client";
import { chatWebSocket, singleChatQueryOptions } from "../../../lib/queries/chatQueries";
import { queryClient } from "../../../lib/queries/queryClient";
import { profileQueryOptions } from "../../../lib/queries/queryOptions";
import { singleErrorsAdapter } from "../../../utils/form-utils";
import { errorTypeGuard } from "../../../utils/type-guards";

const searchInputs = z.object({ contactUsername: z.string() });

export const Route = createFileRoute("/_app/chats/new")({
  component: RouteComponent,
  validateSearch: zodValidator(searchInputs),
  loaderDeps: (opts) => opts.search,
  loader: async (ctx) => {
    return await ctx.context.queryClient.fetchQuery(profileQueryOptions(ctx.deps.contactUsername));
  },
});

function RouteComponent() {
  const contact = Route.useLoaderData();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      text: "",
      receiverId: contact.id,
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
  });

  const handleSendMessage = useMutation({
    mutationKey: ["chat", "new", contact.username],
    mutationFn: async (value: { text: string; receiverId: string }) => {
      const res = await api.chats.messages.$post({
        json: { receiverId: value.receiverId, text: value.text },
      });
      const data = await res.json();
      if ("issues" in data || !("chatId" in data)) {
        throw new Error("Error while creating a chat.");
      }
      return data;
    },
    onSuccess: (data) => {
      chatWebSocket.send(JSON.stringify({ receiver: contact.id, chatId: data.chatId }));
      queryClient.ensureQueryData(singleChatQueryOptions(data.chatId));
      navigate({
        to: "/chats/$chatId",
        params: { chatId: data.chatId },
        replace: true,
      });
    },
  });

  const viewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
          params={{ username: contact.username }}
          className="flex h-28 w-full items-center justify-between rounded-xl rounded-b-none bg-muted p-8 hover:bg-muted-foreground/30 hover:text-foreground"
        >
          <Avatar>
            <AvatarImage src={contact.avatarUrl} alt={`${contact.username} profile picture`} />
          </Avatar>
          <div className="text-lg font-semibold">{title(contact.username)}</div>
        </Link>

        <ScrollArea className="h-full w-full" viewportRef={viewportRef}>
          <div className="grid w-full gap-8 rounded-xl p-8"></div>
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
