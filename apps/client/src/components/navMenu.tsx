import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "@tanstack/react-router";
import { useUser } from "../hooks/auth";

export default function NavMenu() {
  const user = useUser();
  const isAuthenticated = !!user;
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {!isAuthenticated ? (
          <>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link to="/login">Login</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link to="/signup">Signup</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </>
        ) : null}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
