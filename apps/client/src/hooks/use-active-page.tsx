import { useLocation } from "@tanstack/react-router";

export function useActivePage() {
  const { pathname } = useLocation();
  const sections = pathname
    .split("/")
    .slice(1)
    .map((sec) => decodeURIComponent(sec.toLocaleLowerCase()));
  const [mainSection, subSection] = sections;
  const activePage = subSection || mainSection;
  return { mainSection, subSection, activePage };
}
