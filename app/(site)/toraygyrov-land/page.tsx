import type { Metadata } from "next";
import { SectionPageView } from "@/components/section/section-page-view";
import { sectionMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateMetadata({ searchParams }: { searchParams: { lang?: string } }): Metadata {
  return sectionMetadata("toraygyrov-land", searchParams);
}

export default function Page({ searchParams }: { searchParams: { lang?: string } }) {
  return <SectionPageView slug="toraygyrov-land" searchParams={searchParams} />;
}
