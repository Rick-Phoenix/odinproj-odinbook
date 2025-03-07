import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type FC } from "react";
import { z } from "zod";
import { insertPostSchema } from "../../lib/db-types";
import { api } from "../../lib/hono-RPC";
import { formatFormErrors, singleErrorsAdapter } from "../../utils/form-utils";
import { errorTypeGuard } from "../../utils/type-guards";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const CreatePostSidebarDialogForm: FC<{
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpen }) => {
  const queryClient = useQueryClient();
  const { data: subs } = useQuery<string[]>({ queryKey: ["roomSubs"] });
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      text: "",
      roomName: subs?.[0] || "",
    },
    validators: {
      onChange: insertPostSchema.extend({ roomName: z.string() }),
      onSubmit: ({ value }) =>
        subs?.find((r) => r === value.roomName)
          ? undefined
          : "You are not subscribed to this room.",
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
    mutationFn: async (value: { title: string; text: string; roomName: string }) => {
      const { title, text, roomName } = value;
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
        params: { roomName: variables.roomName, postId: data.id },
      });
      setOpen(false);
    },
  });
  return (
    <>
      {!subs?.length ? (
        <div className="p-1 italic">You must subscribe to a room before creating a post.</div>
      ) : (
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
                  name="roomName"
                  children={(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name}>Room</Label>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={(e) => field.handleChange(e)}
                          required
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {subs.map((sub, i) => (
                              <SelectItem key={i} value={sub} className="cursor-pointer">
                                {sub}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.isTouched && formatFormErrors(field.state.meta.errors)}
                      </>
                    );
                  }}
                ></form.Field>
              </div>
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
                          placeholder="A very interesting title"
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
                          placeholder="So, hear me out..."
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
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
      )}
    </>
  );
};

export default CreatePostSidebarDialogForm;
