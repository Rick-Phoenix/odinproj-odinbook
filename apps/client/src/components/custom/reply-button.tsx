import { schemas } from "@nexus/shared-schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { MessageCircleMore } from "lucide-react";
import { useState, type FC } from "react";
import { api, type Comment } from "../../lib/api-client";
import { singleErrorsAdapter } from "../../utils/form-utils";
import { errorTypeGuard } from "../../utils/type-guards";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import CommentLikeButton from "./comment-like-button";

const CommentButtons: FC<{
  parentCommentId: number;
  postId: number;
  setChildren: React.Dispatch<React.SetStateAction<Comment[]>>;
  commentId: number;
  initialIsLiked: boolean;
  initialLikeCount: number;
}> = ({ parentCommentId, postId, setChildren, commentId, initialIsLiked, initialLikeCount }) => {
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
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <CommentLikeButton
          commentId={commentId}
          initialIsLiked={initialIsLiked}
          initialLikeCount={initialLikeCount}
        />
        <Button
          variant={"ghost"}
          className="flex w-fit items-center gap-2 rounded-3xl p-6"
          onClick={() => setIsReplying(true)}
        >
          <MessageCircleMore /> Reply
        </Button>
      </div>
      {isReplying && (
        <>
          <form
            className="flex w-full flex-1 flex-col items-center gap-1 rounded-3xl border p-2 has-[:focus]:border-foreground"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="text"
              children={(field) => (
                <Textarea
                  className="text-md flex-1 rounded-3xl border-0 p-4 focus-visible:[--tw-ring-color:transparent]"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Write a reply"
                  required
                />
              )}
            ></form.Field>
            <div className="flex w-full justify-end gap-2">
              <Button
                variant={"secondary"}
                type="button"
                title="Cancel"
                onClick={() => setIsReplying(false)}
                className="rounded-3xl"
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting, state.isTouched]}
                children={([canSubmit, isSubmitting, isTouched]) => (
                  <Button
                    type="submit"
                    title="Send"
                    aria-disabled={!canSubmit || isSubmitting || !isTouched}
                    disabled={!canSubmit || isSubmitting || !isTouched}
                    variant={"default"}
                    className="rounded-3xl"
                  >
                    Submit
                  </Button>
                )}
              />
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default CommentButtons;
