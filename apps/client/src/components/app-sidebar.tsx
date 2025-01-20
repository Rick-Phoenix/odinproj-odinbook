import {
  Book,
  Box,
  Frame,
  Image,
  LifeBuoy,
  Map,
  MessagesSquare,
  PieChart,
  Send,
  Settings2,
  Store,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "../hooks/auth";
import { Skeleton } from "./ui/skeleton";

const data = {
  navMain: [
    {
      title: "Rooms",
      url: "/rooms",
      icon: Box,
      isActive: true,
      items: [
        {
          title: "Popular",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
      ],
    },
    {
      title: "Chats",
      url: "/chats",
      icon: MessagesSquare,
      items: [
        {
          title: "Chat1",
          url: "#",
        },
        {
          title: "Chat2",
          url: "#",
        },
        {
          title: "Chat3",
          url: "#",
        },
      ],
    },
    {
      title: "Marketplace",
      url: "#",
      icon: Store,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Images",
      url: "#",
      icon: Image,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Library",
      url: "#",
      icon: Book,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();
  return (
    <Sidebar variant="inset" {...props}>
      <Skeleton queryKey={["user"]} className="bg-sidebar-background/50">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <NavUser user={user} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
      </Skeleton>
    </Sidebar>
  );
}
