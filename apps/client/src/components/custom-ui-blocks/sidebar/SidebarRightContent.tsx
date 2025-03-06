import { SidebarContent, SidebarSeparator } from "../../ui/sidebar";
import ChatsSidebarContent from "./SidebarChats";
import MarketplaceSidebarContent from "./SidebarMarketplace";
import UserProfileSidebarContent from "./SidebarProfiles";
import RoomsIndexSidebarContent from "./SidebarRooms";

export default function SidebarRightContent({ mainSection }: { mainSection: string }) {
  return (
    <SidebarContent>
      {mainSection === "rooms" && <RoomsIndexSidebarContent />}
      {mainSection === "chats" && <ChatsSidebarContent />}
      {mainSection === "marketplace" && <MarketplaceSidebarContent />}
      {mainSection === "users" && <UserProfileSidebarContent />}
      <SidebarSeparator className="mx-0" />
    </SidebarContent>
  );
}
