export default function ComparisonSkeleton() {
  return (
    <div className="skeleton-enter grid gap-4 sm:grid-cols-2">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-[#e8eaed] bg-white p-5 shadow-sm"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="mb-4 flex animate-pulse items-center gap-3">
            <div className="h-10 w-10 rounded-full shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 rounded shimmer" />
              <div className="h-3 w-16 rounded shimmer" />
            </div>
          </div>
          <div className="mb-4 h-12 w-20 animate-pulse rounded shimmer" />
          <div className="mb-4 flex animate-pulse gap-2">
            <div className="h-6 w-16 rounded-full shimmer" />
            <div className="h-6 w-20 rounded-full shimmer" />
          </div>
          <div className="animate-pulse space-y-3 border-t border-[#e8eaed] pt-4">
            {[0, 1, 2].map((j) => (
              <div key={j} className="space-y-1">
                <div className="h-3 w-full rounded shimmer" />
                <div className="h-1.5 w-full rounded-full shimmer" />
              </div>
            ))}
          </div>
          <div className="mt-4 h-14 w-full animate-pulse rounded-xl shimmer" />
        </div>
      ))}
    </div>
  );
}
