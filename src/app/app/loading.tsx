export default function Loading() {
  return <div role="status" aria-label="Loading your lodge" className="space-y-6">
    <div className="skeleton h-10 w-48" /><div className="skeleton h-72 w-full" />
    <div className="grid grid-cols-2 gap-4"><div className="skeleton h-32" /><div className="skeleton h-32" /></div>
    <span className="sr-only">Loading your lodge…</span>
  </div>;
}
