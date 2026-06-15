export default function ComparisonSkeleton() {
  return (
    <div className="skeleton-enter space-y-4">
      <div className="h-20 rounded-2xl shimmer" />
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#e8eaed] bg-white p-5 sm:p-6"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-28 rounded shimmer" />
                <div className="h-3 w-20 rounded shimmer" />
              </div>
            </div>
            <div className="mb-5 flex items-center gap-4">
              <div className="h-28 w-28 animate-pulse rounded-full shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-24 rounded-full shimmer" />
                <div className="h-4 w-full rounded shimmer" />
                <div className="h-8 w-32 rounded-lg shimmer" />
              </div>
            </div>
            <div className="animate-pulse space-y-3 border-t border-[#e8eaed] pt-4">
              {[0, 1, 2].map((j) => (
                <div key={j} className="space-y-1.5">
                  <div className="flex justify-between">
                    <div className="h-3 w-12 rounded shimmer" />
                    <div className="h-3 w-16 rounded shimmer" />
                  </div>
                  <div className="h-2 w-full rounded-full shimmer" />
                </div>
              ))}
            </div>
            <div className="mt-4 h-16 w-full rounded-xl shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
