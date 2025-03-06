"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight, MessagesSquare, type LucideIcon } from "lucide-react";
import { title } from "radashi";
import type { FC, JSX } from "react";
import { useActivePage } from "../../hooks/useActivePage";
import { useIsMobile } from "../../hooks/useMobile";
import SidebarRightContent from "../custom-ui-blocks/sidebar/SidebarRightContent";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string | JSX.Element;
    }[];
  }[];
}) {
  const { mainSection } = useActivePage();
  const isMobile = useIsMobile();
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = title(mainSection) === item.title;
            return (
              <Collapsible key={item.title} asChild defaultOpen={!isMobile}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className="transition-colors"
                  >
                    <Link
                      to={item.url}
                      className={isActive ? "*:font-semibold [&_svg]:stroke-primary" : ""}
                    >
                      {item.title === "Chats" ? (
                        <ChatSidebarButton title={item.title} />
                      ) : (
                        <>
                          <item.icon />
                          <span className="text-inherit">{item.title}</span>
                        </>
                      )}
                    </Link>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) =>
                            typeof subItem.url === "string" ? (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link to={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ) : (
                              <SidebarMenuSubItem key={subItem.title}>
                                {subItem.url}
                              </SidebarMenuSubItem>
                            )
                          )}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
      {isMobile && mainSection !== "settings" && (
        <SidebarGroup>
          <SidebarGroupLabel>{title(mainSection)}</SidebarGroupLabel>
          <SidebarRightContent mainSection={mainSection} />
        </SidebarGroup>
      )}
    </>
  );
}

const ChatSidebarButton: FC<{ title: string }> = ({ title }) => {
  const unreadMessages = useQuery({ queryKey: ["unreadMessages"], initialData: [] });
  const hasUnreadMessages = !!unreadMessages.data.length;
  return (
    <div style={{ fontWeight: "inherit" }} className="flex w-full items-center justify-between">
      <span className="flex items-center gap-2">
        <MessagesSquare size={16} />
        <span>{title}</span>
      </span>
      {hasUnreadMessages && <span className="size-2 rounded-full bg-red-500" />}
    </div>
  );
};
