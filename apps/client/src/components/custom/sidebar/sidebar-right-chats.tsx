import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { chatsQueryOptions } from "../../../lib/chatQueries";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { SidebarMenu, SidebarMenuButton } from "../../ui/sidebar";
import CreateChatDialog from "../CreateChatDialog";

const ChatsSidebarContent = () => {
  const { data: chats } = useSuspenseQuery(chatsQueryOptions);

  return (
    <>
      {
        <SidebarMenu>
          <CreateChatDialog>
            <Button variant={"outline"} size={"lg"} className="[&_svg]:size-5">
              <Plus />
              <span>Create Chat</span>
            </Button>
          </CreateChatDialog>

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
      }
    </>
  );
};

export default ChatsSidebarContent;
