import { useLocation } from "@tanstack/react-router";

export function useActivePage() {
  const { pathname } = useLocation();
  const sections = pathname.split("/").slice(1);
  sections.forEach((sec) => sec.toLocaleLowerCase());
  const [mainSection, subSection] = sections;
  const activePage = subSection || mainSection;
  return { mainSection, subSection, activePage };
}
