import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { type FC, type RefObject } from "react";
import { insertCommentSchema, type Comment } from "../../../lib/db-types";
import { api } from "../../../lib/hono-RPC";
import { singleErrorsAdapter } from "../../../utils/form-utils";
import { errorTypeGuard } from "../../../utils/type-guards";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

const CommentInput: FC<{
  postId: number;
  setRootComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  ref: RefObject<HTMLInputElement | null>;
}> = ({ postId, setRootComments, ref }) => {
  const form = useForm({
    defaultValues: {
      text: "",
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        try {
          await handleComment.mutateAsync(value);
          return null;
        } catch (error) {
          if (errorTypeGuard(error)) return error.message;
        }
      },
      onSubmit: insertCommentSchema.pick({ text: true }),
    },
    validatorAdapter: singleErrorsAdapter,
    onSubmit() {
      form.reset();
    },
  });

  const handleComment = useMutation({
    mutationKey: ["rootComment", postId],
    mutationFn: async (v: { text: string }) => {
      const res = await api.posts[":postId"].comments.$post({
        param: { postId },
        json: { text: v.text },
      });
      const data = await res.json();
      if ("issues" in data) {
        throw new Error("An error occurred while submitting this comment.");
      }
      return data;
    },
    onSuccess(data, variables, context) {
      setRootComments((old) => {
        return [...old, data];
      });
    },
  });

  return (
    <>
      <form
        className="flex items-center rounded-xl border has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="text"
          children={(field) => (
            <>
              <Input
                className="text-md rounded-l-xl border-none p-6 focus-visible:ring-0"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Write a comment"
                ref={ref}
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
              title="Send"
              aria-disabled={!canSubmit || isSubmitting || !isTouched}
              disabled={!canSubmit || isSubmitting || !isTouched}
              variant={"ghost"}
              className="aspect-square h-full rounded-l-none rounded-r-xl border-none hover:bg-muted-foreground/30 focus:bg-muted-foreground/30"
            >
              <Send />
            </Button>
          )}
        />
      </form>
      <form.Subscribe
        selector={(state) => [state.errorMap]}
        children={([errorMap]) =>
          errorMap.onSubmit ? (
            <div className="mt-3 flex w-full justify-center">
              {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                <em>{errorMap.onSubmit?.toString()}</em>
              }
            </div>
          ) : null
        }
      />
    </>
  );
};

export default CommentInput;
