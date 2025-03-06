"use client";

import { ChevronsUpDown, LogOut, SquareUserRound, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { handleLogout, useSuspenseUser } from "../../hooks/auth";
import { Button } from "./button";

export function NavUser() {
  const { isMobile, setOpenMobile } = useSidebar();
  const user = useSuspenseUser()!;
  return (
    <SidebarMenu>
      <SidebarMenuItem className={isMobile ? "flex items-center justify-between" : ""}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="transition-colors data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              style={{ width: isMobile ? "fit-content" : "100%" }}
            >
              <Avatar className="h-8 w-8 rounded-full border-2 border-primary">
                <AvatarImage src={user.avatarUrl} alt={user.username} className="object-cover" />
                <AvatarFallback className="rounded-lg">{user.username}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.username}</span>
                <span className="truncate text-xs">Online</span>
              </div>
              <ChevronsUpDown className={isMobile ? "ml-1 size-4" : "ml-auto size-4"} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem asChild className="p-0 font-normal">
              <Link
                to={"/users/$username"}
                params={{ username: user?.username }}
                onClick={isMobile ? () => setOpenMobile(false) : undefined}
                className="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
              >
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="flex items-center gap-2 truncate font-semibold">
                    <SquareUserRound /> View Profile
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {isMobile && (
          <Button size={"icon"} variant={"ghost"} onClick={() => setOpenMobile(false)}>
            {" "}
            <X />
          </Button>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
