import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";

// Two-column content layout: 70% main + 30% sidebar (sidebar drops below on mobile).
export function ContentShell({
  breadcrumb,
  children,
}: {
  breadcrumb?: Crumb[];
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-site px-4 py-6">
      {breadcrumb && (
        <div className="mb-5">
          <Breadcrumb items={breadcrumb} />
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">{children}</div>
        <Sidebar />
      </div>
    </div>
  );
}
