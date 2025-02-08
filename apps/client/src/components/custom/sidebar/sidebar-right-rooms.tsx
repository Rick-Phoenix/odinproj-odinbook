import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Link,
  useLocation,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { format } from "date-fns";
import type { FC } from "react";
import { useActivePage } from "../../../hooks/use-active-page";
import { roomQueryOptions } from "../../../lib/queryOptions";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { SidebarMenuButton, SidebarSeparator } from "../../ui/sidebar";
import { Table, TableBody, TableCell, TableRow } from "../../ui/table";
import CreateRoomDialog from "./create-room-dialog";

const RoomsIndexSidebarContent = () => {
  const { mainSection, subSection, activePage } = useActivePage();

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
              <SuggestedRoom
                roomAvatar="https://github.com/shadcn.png"
                roomName="cats"
              />
              <SuggestedRoom
                roomAvatar="https://github.com/shadcn.png"
                roomName="cats"
              />
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
                <TableCell className="text-right">Jan 10 2025</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total likes:</TableCell>
                <TableCell className="text-right">32</TableCell>
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
  const { roomName } = useParams({ from: "/_app/rooms/$roomName/" });
  const { orderBy } = useSearch({ from: "/_app/rooms/$roomName/" });
  const { data: room } = useSuspenseQuery(roomQueryOptions(roomName, orderBy));
  const loc = useLocation();
  console.log("🚀 ~ RoomSidebarContent ~ loc:", loc);

  return (
    <>
      <div className="flex h-32 p-6 pb-0 center">
        <Avatar className="h-full w-auto">
          <AvatarImage src={room.avatar} alt={`${room.name} avatar`} />
        </Avatar>
      </div>
      <div className="p-4 text-center text-lg font-semibold">r/{room.name}</div>
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

export default RoomsIndexSidebarContent;
