import { Skeleton } from "@/components/ui/skeleton";

export function SidebarSkeleton() {
  return (
    <aside className="flex h-full w-80 flex-col border-r bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Conversation List */}
      <div className="flex-1 space-y-3 overflow-hidden p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg p-2"
          >
            <Skeleton className="h-11 w-11 rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>
    </aside>
  );
}