import { useLocation } from "@tanstack/react-router";

export function useActivePage() {
  const { pathname } = useLocation();

  if (pathname.startsWith("/rooms")) {
    return "Rooms";
  }
  if (pathname.startsWith("/chats")) {
    return "Chats";
  }
  return null;
}
