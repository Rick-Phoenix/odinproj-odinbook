import { Box, MessagesSquare, Settings2, Store } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import CreatePostSidebarDialog from "./dialogs/custom/CreatePostSidebarDialog";
import CreateRoomDialog from "./dialogs/custom/sidebar/create-room-dialog";

const data = {
  navMain: [
    {
      title: "Rooms",
      url: "/rooms",
      icon: Box,
      isActive: true,
      items: [
        { title: "Create A Room", url: <CreateRoomDialog inSidebar={true} /> },
        { title: "room", url: <CreatePostSidebarDialog /> },
      ],
    },
    {
      title: "Chats",
      url: "/chats",
      icon: MessagesSquare,
      items: [],
    },
    {
      title: "Marketplace",
      url: "/marketplace",
      icon: Store,
      items: [
        {
          title: "My Listings",
          url: "/marketplace/myListings",
        },
        {
          title: "Saved Listings",
          url: "/marketplace/savedListings",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
