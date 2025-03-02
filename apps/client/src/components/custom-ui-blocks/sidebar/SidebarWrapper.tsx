import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { type ReactNode } from "@tanstack/react-router";
import { Toaster } from "../../ui/toaster";
import InsetHeader from "../inset-area/InsetHeader";
import { AppSidebar } from "./AppSidebar";
import SidebarRight from "./SidebarRight";

export default function SidebarWrapper({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <InsetHeader />
        {children}
      </SidebarInset>
      <Toaster />
      <SidebarRight />
    </SidebarProvider>
  );
}
