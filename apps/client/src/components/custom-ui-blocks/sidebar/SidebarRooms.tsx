import { useQueryClient } from "@tanstack/react-query";

import { Link, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { type FC } from "react";
import { useUser } from "../../../hooks/auth";
import { useActivePage } from "../../../hooks/useActivePage";
import type { Room } from "../../../lib/db-types";
import CreatePostDialog from "../../dialogs/CreatePostDialog";
import CreateRoomDialog from "../../dialogs/CreateRoomDialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { SidebarMenuButton, SidebarSeparator } from "../../ui/sidebar";
import SidebarSkeleton from "./SidebarSkeleton";

const RoomsIndexSidebarContent = () => {
  const { mainSection, subSection, activePage } = useActivePage();
  const { createdAt, totalLikes, totalPosts, totalRoomsCreated, totalListings } = useUser()!;
  const queryClient = useQueryClient();
  const suggestedRooms = (queryClient.getQueryData(["suggestedRooms"]) as Room[]) || null;
  return (
    <>
      {activePage === mainSection && (
        <>
          <div className="py-4 pb-2">
            <div className="px-4">
              <CreateRoomDialog />
            </div>
            <SidebarSeparator className="mx-0 mt-4" />
          </div>
          <div className="pb-4">
            <h4 className="text-center text-lg font-semibold">Suggested Rooms</h4>
            <ul className="flex flex-col justify-center gap-2 pt-6">
              {suggestedRooms &&
                suggestedRooms.map((room) => (
                  <SuggestedRoom key={room.name} roomAvatar={room.avatar} roomName={room.name} />
                ))}
            </ul>
          </div>
          <SidebarSeparator className="mx-0" />
          <div className="p-4 text-center text-lg font-semibold">Your Stats</div>
          <div className="flex w-full flex-col gap-1 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Member since:</span>
              <span>{format(new Date(createdAt), "dd MMM y")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total likes:</span>
              <span>{totalLikes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total posts:</span>
              <span>{totalPosts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total rooms created:</span>
              <span>{totalRoomsCreated}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total listings created:</span>
              <span>{totalListings}</span>
            </div>
          </div>
        </>
      )}

      {subSection && <RoomSidebarContent />}
    </>
  );
};

const SuggestedRoom: FC<{ roomAvatar: string; roomName: string }> = ({ roomAvatar, roomName }) => {
  return (
    <li>
      <SidebarMenuButton asChild className="size-full p-3 transition-colors hover:bg-slate-950">
        <Link
          className="flex items-center justify-between gap-2"
          to="/rooms/$roomName"
          params={{ roomName }}
          search={{ orderBy: "likesCount" }}
        >
          <Avatar className="border-2 border-primary">
            <AvatarImage className="object-cover" src={roomAvatar} alt={roomName} />
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
  const roomsIndexParam = useParams({
    from: "/_app/rooms/$roomName/",
    shouldThrow: false,
  });
  const roomPostParam = useParams({
    from: "/_app/rooms/$roomName/posts/$postId",
    shouldThrow: false,
  });
  const roomName = roomsIndexParam?.roomName || roomPostParam?.roomName!;
  const room: Room | undefined = queryClient.getQueryData(["roomPreview", roomName?.toLowerCase()]);
  if (!room) return <SidebarSkeleton />;
  return (
    <>
      <div className="h-32 p-6 pb-0 flex-center">
        <Avatar className="h-full w-auto border-2 border-primary">
          <AvatarImage className="object-cover" src={room.avatar} alt={`${room.name} avatar`} />
        </Avatar>
      </div>
      <Link
        to="/rooms/$roomName"
        params={{ roomName: room.name }}
        className="p-4 text-center text-lg font-semibold hover:underline"
      >
        r/{room.name}
      </Link>
      <CreatePostDialog roomName={room.name} />
      <div className="mt-3 flex w-full flex-col gap-1 p-3 text-sm">
        <div className="flex items-center justify-between">
          <span>Active Members:</span>
          <span>{room.subsCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Created On:</span>
          <span>{`${format(new Date(room.createdAt), "MMM do y")}`}</span>
        </div>
      </div>
      <h1 className="mx-auto mt-3 w-fit rounded-2xl bg-muted p-1 px-2 text-sm flex-center">
        Description
      </h1>
      <div className="p-6 pt-0 text-center">{room.description}</div>
    </>
  );
};

export default RoomsIndexSidebarContent;
