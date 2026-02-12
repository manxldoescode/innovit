import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "/";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${baseUrl}/open-graph.png`],
      videos: [
        {
          title: "AutoSight Demo Video",
          thumbnail_loc: `${baseUrl}/open-graph.png`,
          description: "Watch how teams use AutoSight to monitor streams and collaborate effectively.",
        },
      ],
    },
    {
      url: `${baseUrl}/sign-up`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sign-in`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}

