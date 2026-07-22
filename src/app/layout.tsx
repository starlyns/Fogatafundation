import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Sora, Inter } from "next/font/google";
import { ExperienceProvider } from "@/components/providers/ExperienceProvider";
import "./globals.css";

// Bold, confident display face for headlines; clean sans for body.
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fogata.org"),
  title: "Fogata — Every language. One flame.",
  description:
    "Fogata connects churches, missionaries, and Bible translation ministries to bring Scripture to unreached language communities. Every language. One flame.",
  openGraph: {
    title: "Fogata — Every language. One flame.",
    description:
      "Carry the fire to a language community still waiting for Scripture.",
    type: "website",
    url: "https://fogata.org",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fogata — Every language. One flame.",
    description:
      "Carry the fire to a language community still waiting for Scripture.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>
        {/* Skip link for keyboard users. */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-spark focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
        >
          Skip to content
        </a>
        <ExperienceProvider>{children}</ExperienceProvider>
      </body>
    </html>
  );
}
