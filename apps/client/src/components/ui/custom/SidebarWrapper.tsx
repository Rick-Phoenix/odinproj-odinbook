import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { ReactNode } from "@tanstack/react-router";
import { useActivePage } from "../../../hooks/useActivePage";
import { AppSidebar } from "../../app-sidebar";
import { SidebarRight } from "../../sidebar-right";

export default function SidebarWrapper({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <SidebarHeader />
        {children}
      </SidebarInset>

      <SidebarRight />
    </SidebarProvider>
  );
}
function SidebarHeader() {
  const activePage = useActivePage();
  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">{activePage}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
