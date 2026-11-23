export default function Loading() {
  return (
    <div className="space-y-6 pt-10">
      <div className="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>
      <div className="h-32 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
    </div>
  );
}
