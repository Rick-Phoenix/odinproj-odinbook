import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type FC } from "react";
import { z } from "zod";
import { useUser } from "../../hooks/auth";
import type { Chat } from "../../lib/db-types";
import { profileQueryOptions } from "../../lib/queries/queryOptions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const CreateChatDialogForm: FC<{ setOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  setOpen,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { username } = useUser()!;

  const form = useForm({
    defaultValues: {
      contactUsername: "",
    },
    validators: {
      onSubmitAsync: async ({ value: { contactUsername } }) => {
        if (contactUsername.toLowerCase() === username.toLowerCase())
          return "You cannot message yourself 😅";
        const chat = queryClient
          .getQueryData<Chat[]>(["chats"])!
          .find((chat) => chat.contact.username === contactUsername);
        if (chat) {
          void navigate({
            to: "/chats/$chatId",
            params: { chatId: chat.id },
          });
          return;
        }
        try {
          await queryClient.fetchQuery(profileQueryOptions(contactUsername));
          return null;
        } catch (error) {
          return "This user does not exist.";
        }
      },
      onSubmit: z.object({ contactUsername: z.string() }),
    },
    onSubmit({ value }) {
      form.reset();
      void navigate({
        to: "/chats/new",
        search: { contactUsername: value.contactUsername },
      });
      setOpen(false);
    },
  });

  return (
    <>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="contactUsername"
          children={(field) => (
            <>
              <Label htmlFor="contactUsername" className="mb-1 text-start">
                Contact Username:
              </Label>
              <Input
                name="contactUsername"
                className="mb-1"
                onChange={(e) => field.handleChange(e.target.value)}
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
                {
                  // eslint-disable-next-line @typescript-eslint/no-base-to-string
                  <em>{errorMap.onSubmit?.toString()}</em>
                }
              </div>
            ) : null
          }
        />
      </form>
    </>
  );
};

export default CreateChatDialogForm;
