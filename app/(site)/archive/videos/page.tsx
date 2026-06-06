import { redirect } from "next/navigation";

export default function VideosRedirectPage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const lang = searchParams.lang;
  redirect(`/archive${lang ? `?lang=${lang}` : ""}#videos`);
}
