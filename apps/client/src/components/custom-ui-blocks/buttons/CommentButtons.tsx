import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { EllipsisVertical, MessageCircleMore } from "lucide-react";
import { useState, type FC } from "react";
import { insertCommentSchema, type Comment } from "../../../lib/db-types";
import { api } from "../../../lib/hono-RPC";
import { singleErrorsAdapter } from "../../../utils/form-utils";
import { errorTypeGuard } from "../../../utils/type-guards";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Textarea } from "../../ui/textarea";
import CommentLikeButton from "./CommentLikeButton";

const CommentButtons: FC<{
  parentCommentId: number;
  postId: number;
  setChildren: React.Dispatch<React.SetStateAction<Comment[]>>;
  commentId: number;
  initialIsLiked: boolean;
  initialLikeCount: number;
  isFromUser: boolean;
  initialIsDeleted: boolean;
}> = ({
  parentCommentId,
  postId,
  setChildren,
  commentId,
  initialIsLiked,
  initialLikeCount,
  initialIsDeleted,
  isFromUser,
}) => {
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
      onSubmit: insertCommentSchema.pick({ text: true }),
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
          className="flex min-w-fit items-center gap-2 rounded-3xl hover:text-primary md:p-6"
          onClick={() => setIsReplying(true)}
        >
          <MessageCircleMore /> Reply
        </Button>
        {isFromUser && !initialIsDeleted && <CommentOptions commentId={commentId} />}
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

const CommentOptions: FC<{ commentId: number }> = ({ commentId }) => {
  const handleDelete = useMutation({
    mutationKey: ["commentDeletion", commentId],
    mutationFn: async (c) => {
      const res = await api.posts.comments[":commentId"].$delete({ param: { commentId } });
      const data = await res.json();
      if ("issues" in data) {
        throw new Error("An error occurred while deleting this comment.");
      }
      return data;
    },
  });

  return (
    <AlertDialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            className="flex min-w-max items-center gap-2 rounded-3xl hover:text-primary md:p-6"
          >
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>Delete Comment</DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this comment?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete.mutate()}
            className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CommentButtons;
