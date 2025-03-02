import { Sidebar, SidebarContent, SidebarHeader, SidebarSeparator } from "@/components/ui/sidebar";
import { title } from "radashi";
import * as React from "react";
import { useActivePage } from "../../../hooks/use-active-page";
import { ScrollArea } from "../../ui/scroll-area";
import ChatsSidebarContent from "./SidebarChats";
import MarketplaceSidebarContent from "./SidebarMarketplace";
import UserProfileSidebarContent from "./SidebarProfiles";
import RoomsIndexSidebarContent from "./SidebarRooms";

export default function SidebarRight({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { mainSection } = useActivePage();
  return (
    <Sidebar collapsible="none" className="sticky top-0 hidden lg:flex" {...props}>
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
