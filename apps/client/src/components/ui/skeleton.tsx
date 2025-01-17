import { cn } from "@/utils/shadcn-helper";
import { useIsFetching } from "@tanstack/react-query";

function Skeleton({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const isFetching = useIsFetching({ queryKey: ["user"] });
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
