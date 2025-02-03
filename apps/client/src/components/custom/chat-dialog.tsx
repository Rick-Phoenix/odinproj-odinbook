import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { FC, ReactNode } from "react";
import { z } from "zod";
import { type Chat, api } from "../../lib/api-client";
import { cacheChat } from "../../main";
import { errorTypeGuard } from "../../utils/type-guards";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const ChatDialog: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const form = useForm({
    defaultValues: {
      contactUsername: "",
    },
    validators: {
      onSubmitAsync: async ({ value: { contactUsername } }) => {
        const chat = queryClient
          .getQueryData<Chat[]>(["chats"])!
          .find((chat) => chat.contact.username === contactUsername);
        if (chat) {
          nav({
            to: "/chats/$chatId",
            params: { chatId: chat.id },
          });
          return;
        }
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

  const createChat = useMutation({
    mutationKey: ["chat"],
    mutationFn: async (v: { contactUsername: string }) => {
      const { contactUsername } = v;
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
          <DialogTitle className="mb-4">Create Chat</DialogTitle>
          <form
            className="flex flex-col gap-2"
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

export default ChatDialog;
