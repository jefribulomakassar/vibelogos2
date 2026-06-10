import { notFound } from "next/navigation";
import { getLogoBySlug, getAllLogos } from "@/lib/logos";
import { getDriveThumbnailUrl } from "@/lib/drive";
import { LogoDetailClient } from "@/components/LogoDetailClient";
import type { Metadata } from "next";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const logos = await getAllLogos();
  return logos.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const logo = await getLogoBySlug(params.slug);
  if (!logo) return { title: "Logo Not Found" };
  return {
    title: `${logo.title} — VibeLogos`,
    description: logo.description.slice(0, 160),
    openGraph: {
      title: logo.title,
      description: logo.description.slice(0, 160),
      images: [getDriveThumbnailUrl(logo.logo_file_id, "s800")],
    },
  };
}

export default async function LogoDetailPage({ params }: Props) {
  const logo = await getLogoBySlug(params.slug);
  if (!logo) notFound();

  return <LogoDetailClient logo={logo} />;
}
