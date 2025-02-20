import { Link, type NotFoundRouteProps } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "../components/ui/button";

const NotFoundComponent: FC<NotFoundRouteProps> = ({ data }) => {
  return (
    <div className="flex h-svh w-svw flex-col items-center justify-center gap-5">
      <h1 className="text-3xl">{"Well, that's awkward.."} 😰</h1>
      <p className="italic">This page does not exist.</p>
      <Button asChild>
        <Link to="/" replace={true}>
          Return Home
        </Link>
      </Button>
    </div>
  );
};
export default NotFoundComponent;
