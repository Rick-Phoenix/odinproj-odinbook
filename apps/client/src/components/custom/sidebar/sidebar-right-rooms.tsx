import { useMutation, useQueryClient } from "@tanstack/react-query";

import { schemas } from "@nexus/shared-schemas";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useState, type FC } from "react";
import { useUser } from "../../../hooks/auth";
import { useActivePage } from "../../../hooks/use-active-page";
import { api, type Room } from "../../../lib/api-client";
import {
  formatFormErrors,
  singleErrorsAdapter,
} from "../../../utils/form-utils";
import { errorTypeGuard } from "../../../utils/type-guards";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { SidebarMenuButton, SidebarSeparator } from "../../ui/sidebar";
import { Table, TableBody, TableCell, TableRow } from "../../ui/table";
import CreateRoomDialog from "./create-room-dialog";
import SidebarSkeleton from "./sidebar-skeleton";

const RoomsIndexSidebarContent = () => {
  const { mainSection, subSection, activePage } = useActivePage();
  const {
    createdAt,
    totalLikes,
    totalPosts,
    totalRoomsCreated,
    totalListings,
  } = useUser()!;
  const queryClient = useQueryClient();
  const suggestedRooms = queryClient.getQueryData(["suggestedRooms"]) as Room[];
  return (
    <>
      {activePage === mainSection && (
        <>
          <div className="p-4">
            <CreateRoomDialog />
            <SidebarSeparator className="mx-0" />
            <h4 className="mt-2 text-center text-lg font-semibold">
              Suggested Rooms
            </h4>

            <ul className="flex flex-col justify-center gap-2 pt-6">
              {suggestedRooms.map((room) => (
                <SuggestedRoom
                  key={room.name}
                  roomAvatar={room.avatar}
                  roomName={room.name}
                />
              ))}
            </ul>
          </div>
          <SidebarSeparator className="mx-0" />
          <div className="p-4 text-center text-lg font-semibold">
            Your Stats
          </div>
          <Table className="w-full">
            <TableBody>
              <TableRow>
                <TableCell>Member since:</TableCell>
                <TableCell className="text-right">
                  {format(new Date(createdAt), "dd MMM y")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total likes:</TableCell>
                <TableCell className="text-right">{totalLikes}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total posts:</TableCell>
                <TableCell className="text-right">{totalPosts}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total rooms created:</TableCell>
                <TableCell className="text-right">
                  {totalRoomsCreated}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total listings created:</TableCell>
                <TableCell className="text-right">{totalListings}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}

      {subSection && <RoomSidebarContent />}
    </>
  );
};

const SuggestedRoom: FC<{ roomAvatar: string; roomName: string }> = ({
  roomAvatar,
  roomName,
}) => {
  return (
    <li>
      <SidebarMenuButton asChild className="size-full">
        <Link
          className="flex items-center justify-between gap-2"
          to="/rooms/$roomName"
          params={{ roomName }}
          search={{ orderBy: "likesCount" }}
        >
          <Avatar>
            <AvatarImage src={roomAvatar} alt={roomName} />
            <AvatarFallback>{roomName}</AvatarFallback>
          </Avatar>
          <p>r/{roomName}</p>
        </Link>
      </SidebarMenuButton>
    </li>
  );
};

const RoomSidebarContent = () => {
  const queryClient = useQueryClient();
  const { subSection: roomName } = useActivePage();
  const room = queryClient.getQueryData(["room", roomName]) as Room;
  if (!room) return <SidebarSkeleton />;
  return (
    <>
      <div className="flex h-32 p-6 pb-0 center">
        <Avatar className="h-full w-auto">
          <AvatarImage src={room.avatar} alt={`${room.name} avatar`} />
        </Avatar>
      </div>
      <div className="p-4 text-center text-lg font-semibold">r/{room.name}</div>
      <CreatePostDialog roomName={room.name} />
      <Table className="w-full">
        <TableBody>
          <TableRow>
            <TableCell>Active Members:</TableCell>
            <TableCell className="text-right">{room.subsCount}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Created On:</TableCell>
            <TableCell className="text-right">{`${format(new Date(room.createdAt), "MMM do y")}`}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="p-6">{room.description}</div>
    </>
  );
};

const CreatePostDialog: FC<{ roomName: string }> = ({ roomName }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      text: "",
    },
    validators: {
      onChange: schemas.insertPostSchema,
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
      queryClient.setQueryData(["post", data.id], data);
      navigate({
        to: "/rooms/$roomName/posts/$postId",
        params: { roomName, postId: data.id },
      });
      setOpen(false);
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"lg"} className="mx-2 rounded-md">
          <Plus /> New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Make a new contribution to this community.
          </DialogDescription>
        </DialogHeader>
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
                      <Label htmlFor={field.name}>{field.name}</Label>
                      <Input
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        placeholder="A very interesting title"
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      {field.state.meta.isTouched &&
                        formatFormErrors(field.state.meta.errors)}
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
                      <Label htmlFor={field.name}>{field.name}</Label>
                      <Input
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      {field.state.meta.isTouched &&
                        formatFormErrors(field.state.meta.errors)}
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
      </DialogContent>
    </Dialog>
  );
};

export default RoomsIndexSidebarContent;
