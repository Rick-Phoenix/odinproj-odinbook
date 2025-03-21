import type { ReactNode, Ref } from "react";
import { ScrollArea } from "../../ui/scroll-area";

export default function InsetScrollArea({
  children,
  viewportRef,
  onScroll,
}: {
  children: ReactNode;
  viewportRef?: Ref<HTMLDivElement>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}) {
  return (
    <ScrollArea
      type="always"
      viewportRef={viewportRef}
      onScroll={onScroll}
      className="h-full w-full min-w-0 max-w-full flex-1 [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-200px)]"
    >
      <div className="flex min-w-0 max-w-full flex-1 flex-col gap-5 p-2 !pt-2 pb-6 md:p-4 lg:p-6 xl:p-16">
        {children}
      </div>
    </ScrollArea>
  );
}
