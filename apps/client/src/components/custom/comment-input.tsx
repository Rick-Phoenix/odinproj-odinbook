import { schemas } from "@nexus/shared-schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { type FC, type RefObject } from "react";
import { api, type Comment } from "../../lib/api-client";
import { singleErrorsAdapter } from "../../utils/form-utils";
import { errorTypeGuard } from "../../utils/type-guards";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
      onSubmit: schemas.insertCommentSchema.pick({ text: true }),
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
      console.log(data);
      setRootComments((old) => {
        return [...old, data];
      });
    },
  });

  return (
    <>
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
                className="text-md rounded-l-xl rounded-r-none p-6"
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
              className="aspect-square h-full rounded-l-none rounded-r-xl border border-l-0 hover:bg-muted-foreground/30 focus:bg-muted-foreground/30"
            >
              <Send />
            </Button>
          )}
        />
      </form>
    </>
  );
};

export default CommentInput;
