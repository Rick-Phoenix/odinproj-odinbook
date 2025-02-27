import { schemas } from "@nexus/shared-schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { api, roomCategories, type RoomInputs } from "../../../../lib/api-client";
import { formatFormErrors, singleErrorsAdapter } from "../../../../utils/form-utils";
import { errorTypeGuard } from "../../../../utils/type-guards";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { SidebarMenuSubButton } from "../../../ui/sidebar";

const CreateRoomDialog: FC<{ inSidebar?: boolean }> = ({ inSidebar }) => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      name: "",
      category: "Pets",
      avatar: undefined,
      description: "",
    },
    validators: {
      onChange: schemas.insertRoomSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          await handleCreateRoom.mutateAsync(value);
          return null;
        } catch (error) {
          if (errorTypeGuard(error)) return error.message;
        }
      },
    },
    validatorAdapter: singleErrorsAdapter,
    onSubmit: ({ value }) =>
      navigate({
        to: "/rooms/$roomName",
        params: { roomName: value.name },
        search: { orderBy: "likesCount" },
      }),
  });

  const handleCreateRoom = useMutation({
    mutationKey: ["room", "new"],
    mutationFn: async (value: RoomInputs) => {
      const { avatar, category, description, name } = value;
      const file = avatar
        ? new File([avatar as BlobPart], `avatar-room-${name}`, {
            type: avatar.type,
          })
        : null;
      const res = await api.rooms.$post({
        form: {
          category,
          description,
          name,
          ...(file && { avatar: file }),
        },
      });
      const resData = await res.json();
      if ("issues" in resData) {
        throw new Error(resData.issues[0].message);
      }
      return resData;
    },
  });
  return (
    <Dialog>
      {inSidebar ? (
        <SidebarMenuSubButton asChild className="w-full cursor-pointer">
          <DialogTrigger>Create Room</DialogTrigger>
        </SidebarMenuSubButton>
      ) : (
        <Button size={"lg"} asChild className="h-12 w-full cursor-pointer">
          <DialogTrigger>Create Room</DialogTrigger>
        </Button>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Room</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Rooms are spaces where you can share your ideas and passions with other members of the
          community.
        </DialogDescription>
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
                name="name"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Name</Label>
                      <Input
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        placeholder="r/Allofthecats"
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
                name="category"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Category</Label>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(e) =>
                          field.handleChange(e as (typeof schemas.roomCategoriesArray)[number])
                        }
                        required
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {roomCategories.map((cat, i) => (
                            <SelectItem key={i} value={cat} className="cursor-pointer">
                              {cat}
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
                name="avatar"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Avatar</Label>
                      <Input
                        name={field.name}
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          form.setFieldValue("avatar", file);
                        }}
                      />
                      {field.state.meta.isTouched && formatFormErrors(field.state.meta.errors)}
                    </>
                  );
                }}
              ></form.Field>
            </div>
            <div className="grid gap-2">
              <form.Field
                name="description"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Description</Label>
                      <Input
                        name={field.name}
                        type="text"
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
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.isTouched,
                state.isSubmitted,
              ]}
              children={([canSubmit, isSubmitting, isTouched, isSubmitted]) => {
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
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomDialog;
