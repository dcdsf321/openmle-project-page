import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");

  return {
    title: "OpenMLE — MetA-Evolving towards Recursive Self-Improvement",
    description:
      "OpenMLE is an open full-stack system for studying recursive self-improvement in machine learning engineering.",
    metadataBase: new URL(`${protocol}://${host}`),
    openGraph: {
      title: "OpenMLE",
      description: "MetA-Evolving towards Recursive Self-Improvement",
      images: [
        {
          url: "/og.png",
          width: 1536,
          height: 1024,
          alt: "OpenMLE project",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "OpenMLE",
      description: "MetA-Evolving towards Recursive Self-Improvement",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
