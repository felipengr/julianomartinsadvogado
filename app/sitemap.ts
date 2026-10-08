import type { MetadataRoute } from "next";
import { areaHref, areaPages } from "@/lib/content/areas";
import { getPublishedVersion } from "@/lib/content/get-site-content";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const version = await getPublishedVersion();
  const lastModified = version ? new Date(version.createdAt) : undefined;

  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    ...areaPages.map(({ slug }) => ({
      url: absoluteUrl(areaHref(slug)),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
