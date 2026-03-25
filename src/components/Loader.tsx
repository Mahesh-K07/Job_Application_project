export function Loader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-4 border-muted border-t-primary animate-spin" />
      </div>
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-3 animate-pulse">
      <div className="skeleton-pulse h-5 w-3/4" />
      <div className="skeleton-pulse h-4 w-1/2" />
      <div className="flex gap-2">
        <div className="skeleton-pulse h-6 w-20 rounded-full" />
        <div className="skeleton-pulse h-6 w-24 rounded-full" />
      </div>
      <div className="skeleton-pulse h-4 w-full" />
      <div className="skeleton-pulse h-4 w-2/3" />
    </div>
  );
}
