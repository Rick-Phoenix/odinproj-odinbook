import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import { useUser } from "../../../hooks/auth";
import type { Chat, Profile } from "../../../lib/db-types";
import { chatsQueryOptions } from "../../../lib/queries/chatQueries";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { SidebarMenu } from "../../ui/sidebar";
import SidebarSkeleton from "./SidebarSkeleton";

const UserProfileSidebarContent = () => {
  const queryClient = useQueryClient();
  const profileParams = useParams({
    from: "/_app/users/$username",
    shouldThrow: false,
  });
  const navigate = useNavigate();
  const { username } = useUser()!;
  const profile = queryClient.getQueryData<Profile>([
    "profile",
    profileParams?.username?.toLowerCase(),
  ]);

  if (!profileParams?.username || !profile) return <SidebarSkeleton />;
  const isUserOwnProfile = profile.username.toLowerCase() === username.toLowerCase();

  const handleSendMessage = async () => {
    if (isUserOwnProfile) return;
    const chats = await queryClient.fetchQuery(chatsQueryOptions);
    const existingChat = chats.find((chat: Chat) => chat.contact.username === profile.username) as
      | Chat
      | undefined;
    if (existingChat)
      return navigate({
        to: "/chats/$chatId",
        params: { chatId: existingChat.id },
      });
    void navigate({
      to: "/chats/new",
      search: { contactUsername: profile.username },
    });
  };
  return (
    <>
      <div className="h-32 p-6 pb-0 flex-center">
        <Avatar className="h-full w-auto border-2 border-primary">
          <AvatarImage
            src={profile.avatarUrl}
            className="object-cover"
            alt={`${profile.username} profile picture`}
          />
        </Avatar>
      </div>
      <div className="p-4 pt-0 text-center text-lg font-semibold">{profile.username}</div>
      <div className="flex w-full flex-col items-center gap-4 p-3 pt-0 text-center">
        <div className="flex w-full flex-col justify-between gap-1">
          <div className="text-center text-primary">Status </div>
          <div className="max-w-full break-words">{profile.status}</div>
        </div>
        <div className="flex flex-col justify-between gap-1">
          <div className="text-primary">Member Since </div>
          <div>{`${format(new Date(profile.createdAt), "MMM do y")}`}</div>
        </div>
      </div>
      {!isUserOwnProfile && (
        <SidebarMenu>
          <Button onClick={handleSendMessage} className="mx-2 flex items-center">
            <MessageSquare />
            <span>Send Message</span>
          </Button>
        </SidebarMenu>
      )}
    </>
  );
};

export default UserProfileSidebarContent;
