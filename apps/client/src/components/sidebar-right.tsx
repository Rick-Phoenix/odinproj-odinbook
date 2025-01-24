import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { title } from "radashi";
import type { FC } from "react";
import { useUser } from "../hooks/auth";
import { useActivePage } from "../hooks/use-active-page";
import { lorem2par } from "../utils/lorem";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();
  const { mainSection, activePage } = useActivePage();
  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden border-l lg:flex"
      {...props}
    >
      <SidebarHeader className="flex h-16 items-center justify-center border-b border-sidebar-border text-xl font-semibold">
        {title(mainSection)}
      </SidebarHeader>
      <ScrollArea className="[&_.scrollbar]:bg-muted-foreground/20">
        <SidebarContent>
          {mainSection === "rooms" && <RoomsSidebarContent />}
          {mainSection === "chats" && <ChatsSidebarContent />}
          <SidebarSeparator className="mx-0" />
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
}

const ChatsSidebarContent = () => {
  return (
    <>
      <SidebarMenuButton>
        <Plus />
        <span>New Chat</span>
      </SidebarMenuButton>
    </>
  );
};

const RoomsSidebarContent = () => {
  const { mainSection, subSection, activePage } = useActivePage();
  return (
    <>
      {activePage === mainSection && (
        <>
          <div className="p-4">
            <h4 className="text-center text-lg font-semibold">
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
              <SuggestedRoom
                roomAvatar="https://github.com/shadcn.png"
                roomName="cats"
              />
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

      {subSection && (
        <>
          <div className="flex h-32 p-6 pb-0 center">
            <Avatar className="h-full w-auto">
              <AvatarImage
                src={"https://github.com/shadcn.png"}
                alt={`profile picture`}
              />
            </Avatar>
          </div>
          <div className="p-4 text-center text-lg font-semibold">
            r/{title(subSection)}
          </div>
          <Table className="w-full">
            <TableBody>
              <TableRow>
                <TableCell>Active Members:</TableCell>
                <TableCell className="text-right">20002</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Created On:</TableCell>
                <TableCell className="text-right">22 October 2023</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="p-6">{lorem2par}</div>
        </>
      )}
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
          to="/rooms/$room/posts"
          params={{ room: roomName }}
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
