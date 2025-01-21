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
import { Link, type ReactNode } from "@tanstack/react-router";
import { useActivePage } from "../../hooks/useActivePage";
import { AppSidebar } from "../app-sidebar";
import { SidebarRight } from "../sidebar-right";
import { ScrollArea } from "../ui/scroll-area";

export default function SidebarWrapper({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <InsetHeader />
        <InsetScrollArea>{children}</InsetScrollArea>
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  );
}

function InsetScrollArea({ children }: { children: ReactNode }) {
  return (
    <ScrollArea
      type="always"
      className="h-full w-full flex-1 [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-200px)]"
    >
      <div className="flex flex-1 flex-col gap-4 p-16 pb-6 pt-2">
        {children}
      </div>
    </ScrollArea>
  );
}

function InsetHeader() {
  const activePage = useActivePage();
  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link to={activePage}>{activePage}</Link>
              </BreadcrumbLink>
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
