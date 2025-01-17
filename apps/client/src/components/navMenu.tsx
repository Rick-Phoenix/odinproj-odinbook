import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "@tanstack/react-router";
import { handleLogout, useUser } from "../hooks/auth";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function NavMenu() {
  const user = useUser();
  const isAuthenticated = !!user;
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Skeleton>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              asChild
            >
              <Link to="/">Home</Link>
            </NavigationMenuLink>
          </Skeleton>
        </NavigationMenuItem>
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
        ) : (
          <NavigationMenuItem>
            <NavigationMenuLink
              onClick={handleLogout}
              className={navigationMenuTriggerStyle()}
              asChild
            >
              <Button className="outline-0">Logout</Button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
