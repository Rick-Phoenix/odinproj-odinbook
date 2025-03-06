import { Link } from "@tanstack/react-router";
import { title } from "radashi";
import { useActivePage } from "../../../hooks/useActivePage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
import { Separator } from "../../ui/separator";
import { SidebarTrigger } from "../../ui/sidebar";

export default function InsetHeader() {
  const { mainSection, subSection, activePage } = useActivePage();
  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                {mainSection &&
                  (mainSection === activePage || mainSection === "chats" ? (
                    <Link to={mainSection} className="min-w-fit">
                      <BreadcrumbPage>{title(mainSection)}</BreadcrumbPage>
                    </Link>
                  ) : (
                    <Link to={mainSection === "users" ? "." : mainSection} className="min-w-fit">
                      {title(mainSection)}
                    </Link>
                  ))}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {subSection && mainSection !== "chats" && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={mainSection + "/" + subSection}>
                      <BreadcrumbPage>
                        {subSection === "mylistings"
                          ? "My Listings"
                          : subSection === "savedlistings"
                            ? "Saved Listings"
                            : title(subSection)}
                      </BreadcrumbPage>
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
