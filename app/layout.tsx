import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenMLE — MetA-Evolving towards Recursive Self-Improvement",
  description:
    "OpenMLE is an open full-stack system for studying recursive self-improvement in machine learning engineering.",
  metadataBase: new URL("https://dcdsf321.github.io/openmle-project-page/"),
  openGraph: {
    title: "OpenMLE",
    description: "MetA-Evolving towards Recursive Self-Improvement",
    images: [
      {
        url: "https://dcdsf321.github.io/openmle-project-page/og.png",
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
    images: [
      "https://dcdsf321.github.io/openmle-project-page/og.png",
    ],
  },
};

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
