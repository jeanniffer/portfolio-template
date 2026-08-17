import type { MetadataRoute } from "next";
import { getWorkItems } from "@/lib/work";

const BASE_URL = "https://www.jeanniffer.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const items = getWorkItems();

  const caseStudies: MetadataRoute.Sitemap = items
    .filter((item) => item.kind === "case-study")
    .map((item) => ({
      url: `${BASE_URL}/case-studies/${item.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...caseStudies,
  ];
}
