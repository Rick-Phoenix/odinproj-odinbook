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
import { title } from "radashi";
import { useActivePage } from "../../hooks/use-active-page";
import { AppSidebar } from "../app-sidebar";
import { SidebarRight } from "../sidebar-right";
import { ScrollArea } from "../ui/scroll-area";

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

export function InsetScrollArea({ children }: { children: ReactNode }) {
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

export function StaticInset({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-h-full min-h-full flex-1 flex-col gap-4 p-16 pt-2">
      {children}
    </div>
  );
}

function InsetHeader() {
  const { mainSection, subSection, activePage } = useActivePage();
  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                {mainSection &&
                  (mainSection === activePage ? (
                    <Link to={mainSection}>
                      <BreadcrumbPage>{title(mainSection)}</BreadcrumbPage>
                    </Link>
                  ) : (
                    <Link to={mainSection}>{title(mainSection)}</Link>
                  ))}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {subSection && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={mainSection + "/" + subSection}>
                      <BreadcrumbPage>{title(subSection)}</BreadcrumbPage>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
