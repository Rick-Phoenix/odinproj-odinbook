import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { type ReactNode } from "@tanstack/react-router";
import { AppSidebar } from "../app-sidebar";
import InsetHeader from "./inset-header";
import { SidebarRight } from "./sidebar-right";

export default function SidebarWrapper({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <InsetHeader />
        {children}
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  );
}
