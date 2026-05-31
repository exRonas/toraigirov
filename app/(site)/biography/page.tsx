import type { Metadata } from "next";
import { SectionPageView } from "@/components/section/section-page-view";
import { sectionMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateMetadata({ searchParams }: { searchParams: { lang?: string } }): Metadata {
  return sectionMetadata("biography", searchParams);
}

export default function Page({ searchParams }: { searchParams: { lang?: string } }) {
  return <SectionPageView slug="biography" searchParams={searchParams} />;
}
