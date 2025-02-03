import type { ReactNode } from "react";
import { ScrollArea } from "../ui/scroll-area";

export default function InsetScrollArea({ children }: { children: ReactNode }) {
  return (
    <ScrollArea
      type="always"
      className="h-full w-full min-w-0 max-w-full flex-1 [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-200px)]"
    >
      <div className="flex min-w-0 max-w-full flex-1 flex-col gap-4 p-16 pb-6 pt-2">
        {children}
      </div>
    </ScrollArea>
  );
}
