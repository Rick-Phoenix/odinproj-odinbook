import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import { api, type Chat, type Profile } from "../../../lib/api-client";
import { cacheChat, chatsQueryOptions } from "../../../lib/chatQueries";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { SidebarMenu } from "../../ui/sidebar";
import { Table, TableBody, TableCell, TableRow } from "../../ui/table";
import SidebarSkeleton from "./sidebar-skeleton";

const UserProfileSidebarContent = () => {
  const queryClient = useQueryClient();
  const profileParams = useParams({
    from: "/_app/users/$username",
    shouldThrow: false,
  });
  const profile = queryClient.getQueryData([
    "profile",
    profileParams?.username,
  ]) as Profile | undefined;
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

  if (!profile) return <SidebarSkeleton />;

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

export default UserProfileSidebarContent;
