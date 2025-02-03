import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { type ReactNode } from "@tanstack/react-router";
import { AppSidebar } from "../app-sidebar";
import { SidebarRight } from "../sidebar-right";
import InsetHeader from "./inset-header";

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
