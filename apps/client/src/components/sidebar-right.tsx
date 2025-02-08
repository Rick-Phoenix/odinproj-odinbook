import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cacheChat, chatsQueryOptions } from "@/lib/chatQueries";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  Link,
  useLoaderData,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { format } from "date-fns";
import { MessageSquare, Plus } from "lucide-react";
import { title } from "radashi";
import type { FC } from "react";
import { useActivePage } from "../hooks/use-active-page";
import { api, type Chat, type Room } from "../lib/api-client";
import ChatDialog from "./custom/chat-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
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
          {mainSection === "rooms" && <RoomsIndexSidebarContent />}
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
  const profile = useLoaderData({ from: "/_app/users/$username" });
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const createChat = useMutation({
    mutationKey: ["chat"],
    mutationFn: async (v: { contactUsername: string }) => {
      const { contactUsername } = v;
      const res = await api.chats.$post({ json: { contactUsername } });
      const data = await res.json();
      if ("issues" in data) {
        throw new Error(data.issues[0].message);
      }
      return data;
    },
    onSuccess(data) {
      queryClient.setQueryData(["chats"], (old: Chat[]) => [...old, data]);
      cacheChat(data);
      nav({ to: "/chats/$chatId", params: { chatId: data.id } });
    },
  });

  const handleSendMessage = async () => {
    const chats = await queryClient.fetchQuery(chatsQueryOptions);
    const existingChat = chats.find(
      (chat) => chat.contact.username === profile.username,
    );
    if (existingChat)
      return nav({ to: "/chats/$chatId", params: { chatId: existingChat.id } });
    createChat.mutate({ contactUsername: profile.username });
  };
  return (
    <>
      <div className="flex h-32 p-6 pb-0 center">
        <Avatar className="h-full w-auto">
          <AvatarImage
            src={profile.avatarUrl}
            alt={`${profile.username} profile picture`}
          />
        </Avatar>
      </div>
      <div className="p-4 pt-0 text-center text-lg font-semibold">
        {profile.username}
      </div>
      <Table className="w-full">
        <TableBody>
          <TableRow>
            <TableCell>Member Since:</TableCell>
            <TableCell className="text-right">{`${format(new Date(profile.createdAt), "MMM do y")}`}</TableCell>
          </TableRow>
          <TableRow>{profile.status}</TableRow>
        </TableBody>
      </Table>
      <SidebarMenu>
        <Button
          variant={"outline"}
          onClick={handleSendMessage}
          className="mx-2 flex items-center"
        >
          <MessageSquare />
          <span>Send Message</span>
        </Button>
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

const ChatSidebarContent = () => {
  const { chatId } = useParams({ from: "/_app/chats/$chatId" });
  const {
    data: { contact },
  } = useSuspenseQuery<Chat>({ queryKey: ["chat", chatId] });

  return (
    <>
      <div className="flex h-32 p-6 pb-0 center">
        <Avatar className="h-full w-auto">
          <AvatarImage
            src={contact.avatarUrl}
            alt={`${contact.username} profile picture`}
          />
        </Avatar>
      </div>
      <div className="p-4 text-center text-lg font-semibold">
        {contact.username}
      </div>
      <Button className="mx-2" variant={"outline"} asChild>
        <Link to={"/users/$username"} params={{ username: contact.username }}>
          View Profile
        </Link>
      </Button>
    </>
  );
};

const ChatsSidebarContent = () => {
  const { subSection, mainSection, activePage } = useActivePage();
  const { data: chats } = useSuspenseQuery(chatsQueryOptions);

  if (subSection) return <ChatSidebarContent />;
  return (
    <>
      {mainSection === activePage && (
        <SidebarMenu>
          <ChatDialog>
            <Button variant={"outline"} size={"lg"} className="[&_svg]:size-5">
              <Plus />
              <span>Create Chat</span>
            </Button>
          </ChatDialog>

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

const RoomsIndexSidebarContent = () => {
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
  const { subSection } = useActivePage();
  const queryClient = useQueryClient();
  const room = queryClient.getQueryData(["room", subSection]) as Room;

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
