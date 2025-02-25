import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState, type FC, type ReactNode } from "react";
import { z } from "zod";
import { useUser } from "../../../hooks/auth";
import { type Chat } from "../../../lib/api-client";
import { profileQueryOptions } from "../../../lib/queries/queryOptions";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const CreateChatDialog: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { username } = useUser()!;

  const form = useForm({
    defaultValues: {
      contactUsername: "",
    },
    validators: {
      onSubmitAsync: async ({ value: { contactUsername } }) => {
        if (contactUsername.toLowerCase() === username.toLowerCase()) return "You cannot message yourself 😅";
        const chat = queryClient
          .getQueryData<Chat[]>(["chats"])!
          .find((chat) => chat.contact.username === contactUsername);
        if (chat) {
          navigate({
            to: "/chats/$chatId",
            params: { chatId: chat.id },
          });
          return;
        }
        try {
          const contact = await queryClient.fetchQuery(profileQueryOptions(contactUsername));
          return null;
        } catch (error) {
          return "This user does not exist.";
        }
      },
      onSubmit: z.object({ contactUsername: z.string() }),
    },
    onSubmit({ value }) {
      form.reset();
      navigate({
        to: "/chats/new",
        search: { contactUsername: value.contactUsername },
      });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                  <Input name="contactUsername" onChange={(e) => field.handleChange(e.target.value)} required />
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
                >
                  Create Chat
                </Button>
              )}
            />
            <form.Subscribe
              selector={(state) => [state.errorMap]}
              children={([errorMap]) =>
                errorMap.onSubmit ? (
                  <div className="text-center">
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

export default CreateChatDialog;
