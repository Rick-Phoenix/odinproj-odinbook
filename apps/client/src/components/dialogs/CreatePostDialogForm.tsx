import { insertPostSchema } from "@nexus/shared-schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type FC } from "react";
import { api } from "../../lib/hono-RPC";
import { formatFormErrors, singleErrorsAdapter } from "../../utils/form-utils";
import { errorTypeGuard } from "../../utils/type-guards";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const CreatePostDialogForm: FC<{
  roomName: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ roomName, setOpen }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      text: "",
    },
    validators: {
      onChange: insertPostSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          await handleCreatePost.mutateAsync(value);
          return null;
        } catch (error) {
          if (errorTypeGuard(error)) return error.message;
        }
      },
    },
    validatorAdapter: singleErrorsAdapter,
  });

  const handleCreatePost = useMutation({
    mutationKey: ["post", "new"],
    mutationFn: async (value: { title: string; text: string }) => {
      const { title, text } = value;
      const res = await api.rooms[":roomName"].posts.$post({
        json: { text, title },
        param: { roomName },
      });
      const newPost = await res.json();
      if ("issues" in newPost) {
        throw new Error(newPost.issues[0].message);
      }
      return newPost;
    },
    onSuccess(data, variables, context) {
      if (queryClient.getQueryData(["roomPreview", data.room.toLowerCase()])) {
        queryClient.setQueryData(["fullPost", data.id], {
          ...data,
          comments: [],
        });
      }
      navigate({
        to: "/rooms/$roomName/posts/$postId",
        params: { roomName, postId: data.id },
      });
      setOpen(false);
    },
  });
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <form.Field
              name="title"
              children={(field) => {
                return (
                  <>
                    <Label htmlFor={field.name}>Title</Label>
                    <Input
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      placeholder="A very interesting title..."
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                    />
                    {field.state.meta.isTouched && formatFormErrors(field.state.meta.errors)}
                  </>
                );
              }}
            ></form.Field>
          </div>
          <div className="grid gap-2">
            <form.Field
              name="text"
              children={(field) => {
                return (
                  <>
                    <Label htmlFor={field.name}>Text</Label>
                    <Input
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="An even more interesting text..."
                      required
                    />
                    {field.state.meta.isTouched && formatFormErrors(field.state.meta.errors)}
                  </>
                );
              }}
            ></form.Field>
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isTouched]}
            children={([canSubmit, isTouched]) => {
              return (
                <DialogFooter>
                  <Button
                    type="submit"
                    aria-disabled={!canSubmit || !isTouched}
                    disabled={!canSubmit || !isTouched}
                    className="w-full"
                  >
                    Submit
                  </Button>
                </DialogFooter>
              );
            }}
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
        </div>
      </form>
    </>
  );
};

export default CreatePostDialogForm;
