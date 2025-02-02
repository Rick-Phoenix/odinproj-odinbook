import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { Flag, MessageSquare, Plus } from "lucide-react";
import { title } from "radashi";
import type { FC } from "react";
import { useActivePage } from "../hooks/use-active-page";
import { chatsQueryOptions } from "../main";
import { ChatDialog } from "../routes/_app/chats";
import { lorem2par } from "../utils/lorem";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { mainSection } = useActivePage();
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
          {mainSection === "marketplace" && <MarketplaceSidebarContent />}
          {mainSection === "users" && <UserProfileSidebarContent />}
          <SidebarSeparator className="mx-0" />
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
}

const UserProfileSidebarContent = () => {
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="[&_svg]:size-5">
            <MessageSquare />
            <span>Send Message</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton className="[&_svg]:size-5">
            <Flag />
            <span>Report User</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
};

const MarketplaceSidebarContent = () => {
  const { itemId } = useParams({ strict: false });
  return (
    <>
      {!itemId && (
        <>
          <Table className="w-full">
            <TableBody>
              <TableRow>
                <TableCell>Active Listings:</TableCell>
                <TableCell className="text-right">0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Saved Items:</TableCell>
                <TableCell className="text-right">0</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}
      {itemId && (
        <>
          <div className="p-4 pb-0 text-center text-lg font-semibold">
            Seller
          </div>
          <div className="flex h-32 p-6 pb-0 center">
            <Avatar className="h-full w-auto">
              <AvatarImage
                src={"https://github.com/shadcn.png"}
                alt={`profile picture`}
              />
            </Avatar>
          </div>
          <div className="p-4 pt-0 text-center text-lg font-semibold">
            {"sellernickname"}
          </div>
          <Table className="w-full">
            <TableBody>
              <TableRow>
                <TableCell>Member Since:</TableCell>
                <TableCell className="text-right">20002</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Items Sold:</TableCell>
                <TableCell className="text-right">12</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Average Feedback:</TableCell>
                <TableCell className="text-right">5/5</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
};

const ChatsSidebarContent = () => {
  const { subSection, mainSection, activePage } = useActivePage();
  const { data: chats } = useSuspenseQuery(chatsQueryOptions);
  return (
    <>
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
            {title(subSection)}
          </div>
          <Table className="w-full">
            <TableBody>
              <TableRow>
                <TableCell>Member Since:</TableCell>
                <TableCell className="text-right">20002</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Most Active Rooms:</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Member Since:</TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Member Since:</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status:</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  Just here for the biscuits!
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <SidebarMenuButton className="flex items-center">
            <Flag />
            <span>Report User</span>
          </SidebarMenuButton>
        </>
      )}
      {mainSection === activePage && (
        <SidebarMenu>
          <SidebarMenuItem>
            <ChatDialog>
              <SidebarMenuButton className="[&_svg]:size-5">
                <Plus />
                <span>Create Chat</span>
              </SidebarMenuButton>
            </ChatDialog>
          </SidebarMenuItem>
          <ul className="flex flex-col justify-center gap-2 pt-6">
            {chats.map((chat) => (
              <li key={chat.id}>
                <SidebarMenuButton asChild className="size-full">
                  <Link
                    className="flex items-center justify-between gap-2"
                    to="/chats/$chatId"
                    params={{ chatId: chat.id }}
                  >
                    <Avatar className="h-14 w-auto">
                      <AvatarImage
                        src={chat.contact.avatarUrl}
                        alt={chat.contact.username}
                      />
                      <AvatarFallback>{chat.contact.username}</AvatarFallback>
                    </Avatar>
                    <p>{chat.contact.username}</p>
                  </Link>
                </SidebarMenuButton>
              </li>
            ))}
          </ul>
        </SidebarMenu>
      )}
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
