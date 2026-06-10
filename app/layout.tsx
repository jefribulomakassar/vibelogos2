import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VibeLogos — Premium Logo Marketplace",
  description:
    "Discover unique, modern logo designs for your brand. Browse premium logos by jeflodesign.",
  keywords: ["logo", "logo design", "brand", "marketplace", "buy logo"],
  openGraph: {
    title: "VibeLogos — Premium Logo Marketplace",
    description: "Discover unique, modern logo designs for your brand.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
