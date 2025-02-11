import { schemas } from "@nexus/shared-schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { MessageCircleMore, Send, X } from "lucide-react";
import { useState, type FC } from "react";
import { api, type Comment } from "../../lib/api-client";
import { singleErrorsAdapter } from "../../utils/form-utils";
import { errorTypeGuard } from "../../utils/type-guards";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const ReplyButton: FC<{
  parentCommentId: number;
  postId: number;
  setChildren: React.Dispatch<React.SetStateAction<Comment[]>>;
}> = ({ parentCommentId, postId, setChildren }) => {
  const [isReplying, setIsReplying] = useState(false);

  const form = useForm({
    defaultValues: {
      text: "",
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        try {
          await handleReply.mutateAsync(value);
          return null;
        } catch (error) {
          if (errorTypeGuard(error)) return error.message;
        }
      },
      onSubmit: schemas.insertCommentSchema.pick({ text: true }),
    },
    validatorAdapter: singleErrorsAdapter,
    onSubmit() {
      form.reset();
    },
  });

  const handleReply = useMutation({
    mutationKey: ["commentReply", parentCommentId],
    mutationFn: async (v: { text: string }) => {
      const res = await api.posts[":postId"].comments.$post({
        param: { postId },
        json: { parentCommentId, text: v.text },
      });
      const data = await res.json();
      if ("issues" in data) {
        throw new Error("An error occurred while replying to this comment.");
      }
      return data;
    },
    onSuccess(data, variables, context) {
      setIsReplying(false);
      setChildren((old) => {
        return [...old, data];
      });
    },
  });

  return (
    <>
      {!isReplying ? (
        <Button
          variant={"ghost"}
          className="flex w-fit items-center gap-2 rounded-xl"
          onClick={() => setIsReplying(true)}
        >
          <MessageCircleMore /> Reply
        </Button>
      ) : (
        <>
          <form
            className="flex items-center"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <Button
              variant={"ghost"}
              type="button"
              title="Cancel"
              onClick={() => setIsReplying(false)}
              className="aspect-square rounded-l-xl rounded-r-none border border-r-0 py-0 hover:bg-muted-foreground/30 focus:bg-muted-foreground/30"
            >
              <X />
            </Button>
            <form.Field
              name="text"
              children={(field) => (
                <>
                  <Input
                    className="text-md rounded-l-none rounded-r-none border-x-0"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Write a reply"
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
                  title="Send"
                  aria-disabled={!canSubmit || isSubmitting || !isTouched}
                  disabled={!canSubmit || isSubmitting || !isTouched}
                  variant={"ghost"}
                  className="aspect-square rounded-l-none rounded-r-xl border border-l-0 hover:bg-muted-foreground/30 focus:bg-muted-foreground/30"
                >
                  <Send />
                </Button>
              )}
            />
          </form>
        </>
      )}
    </>
  );
};

export default ReplyButton;
