export default function Loading() {
  return (
    <div className="mx-auto max-w-site px-4 py-8">
      <div className="skeleton h-5 w-48" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="skeleton h-10 w-2/3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-11/12" />
          <div className="skeleton h-4 w-10/12" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="skeleton h-56 w-full" />
            <div className="skeleton h-56 w-full" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-64 w-full" />
          <div className="skeleton h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
