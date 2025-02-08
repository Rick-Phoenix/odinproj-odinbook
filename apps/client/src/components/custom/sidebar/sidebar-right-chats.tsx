import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useActivePage } from "../../../hooks/use-active-page";
import type { Chat } from "../../../lib/api-client";
import { chatsQueryOptions } from "../../../lib/chatQueries";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { SidebarMenu, SidebarMenuButton } from "../../ui/sidebar";
import ChatDialog from "../chat-dialog";

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
export default ChatsSidebarContent;
