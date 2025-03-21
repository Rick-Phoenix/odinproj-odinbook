import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { FC } from "react";
import { useChats } from "../../../hooks/useChats";
import { useUnreadMessages } from "../../../hooks/useUnreadMessages";
import type { Chat } from "../../../lib/db-types";
import CreateChatDialog from "../../dialogs/CreateChatDialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { SidebarMenu, SidebarMenuButton } from "../../ui/sidebar";

const ChatsSidebarContent = () => {
  const chats = useChats();
  return (
    <>
      {
        <SidebarMenu>
          <div className="flex justify-center p-3">
            <CreateChatDialog>
              <Button className="flex-1 bg-primary/50 transition-colors hover:bg-primary [&_svg]:size-5">
                <Plus />
                <span>Create Chat</span>
              </Button>
            </CreateChatDialog>
          </div>

          <ul className="flex flex-col justify-center gap-2 pt-2">
            {chats.map((chat) => (
              <ChatPreview key={chat.id} chat={chat} />
            ))}
          </ul>
        </SidebarMenu>
      }
    </>
  );
};

const ChatPreview: FC<{ chat: Chat }> = ({ chat }) => {
  const unreadMessages = useUnreadMessages(chat.id);
  return (
    <li>
      <SidebarMenuButton asChild className="size-full transition-colors">
        {chat.contact.username !== "[deleted]" ? (
          <Link
            className="flex items-center justify-between gap-2"
            to="/chats/$chatId"
            params={{ chatId: chat.id }}
          >
            <div className="relative">
              {unreadMessages && (
                <span className="absolute right-0 z-10 size-3 rounded-full bg-red-500" />
              )}
              <Avatar className="h-14 w-auto border-2 border-primary">
                <AvatarImage
                  src={chat.contact.avatarUrl}
                  className="object-cover"
                  alt={chat.contact.username}
                />
                <AvatarFallback>{chat.contact.username}</AvatarFallback>
              </Avatar>
            </div>
            <p>{chat.contact.username}</p>
          </Link>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="relative">
              {unreadMessages && (
                <span className="absolute right-0 z-10 size-3 rounded-full bg-red-500" />
              )}
              <Avatar className="h-14 w-auto">
                <AvatarImage
                  src={chat.contact.avatarUrl}
                  className="object-cover"
                  alt={chat.contact.username}
                />
                <AvatarFallback>{chat.contact.username}</AvatarFallback>
              </Avatar>
            </div>
            <p className="italic text-muted-foreground">Deleted User</p>
          </div>
        )}
      </SidebarMenuButton>
    </li>
  );
};

export default ChatsSidebarContent;
