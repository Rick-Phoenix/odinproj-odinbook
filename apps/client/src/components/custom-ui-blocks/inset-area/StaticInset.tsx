import type { ReactNode } from "react";

export default function StaticInset({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full max-h-full min-h-0 flex-1 flex-col gap-4 p-8 !pt-2 pb-6 lg:pt-2 xl:p-16">
      {children}
    </div>
  );
}
