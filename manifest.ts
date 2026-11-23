import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nexus Academics",
    short_name: "Nexus",
    description: "University of Ghana Level 100 IT study group",
    start_url: "/",
    display: "standalone",
    background_color: "#060912",
    theme_color: "#0c1220",
    icons: [
      { src: "/icons/nexus-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/nexus-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
