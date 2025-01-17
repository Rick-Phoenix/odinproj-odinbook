import { cn } from "@/utils/shadcn-helper";
import { useIsFetching } from "@tanstack/react-query";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  queryKey?: unknown[];
}

function Skeleton({ className, children, queryKey, ...props }: SkeletonProps) {
  const isFetching = useIsFetching({ queryKey });
  if (!isFetching) return children;
  return (
    <div className="relative inline-block">
      <div
        className={cn(
          "absolute inset-0 animate-pulse rounded-md bg-secondary",
          className
        )}
        {...props}
      />
      <div className="invisible">{children}</div>
    </div>
  );
}

export { Skeleton };
