import { Link } from "@tanstack/react-router";
import { title } from "radashi";
import { useActivePage } from "../../hooks/use-active-page";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

export default function InsetHeader() {
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
                    <Link to={mainSection === "users" ? "." : mainSection}>
                      {title(mainSection)}
                    </Link>
                  ))}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {subSection && mainSection !== "chats" && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
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
