import { Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import { title } from "radashi";
import * as React from "react";
import { useActivePage } from "../../../hooks/useActivePage";
import { useIsMobile } from "../../../hooks/useMobile";
import { ScrollArea } from "../../ui/scroll-area";
import SidebarRightContent from "./SidebarRightContent";

export default function SidebarRight({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { mainSection } = useActivePage();
  const isMobile = useIsMobile();
  if (isMobile) return <></>;
  return (
    <Sidebar collapsible="none" className="sticky top-0 hidden lg:flex" {...props}>
      <SidebarHeader className="flex h-16 items-center justify-center border-b border-sidebar-border text-xl font-semibold">
        {title(mainSection)}
      </SidebarHeader>
      <ScrollArea className="[&_.scrollbar]:bg-muted-foreground/20">
        {<SidebarRightContent mainSection={mainSection} />}
      </ScrollArea>
    </Sidebar>
  );
}
