import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SITE_URL } from "../lib/site";
import "./globals.css";

// The font variable sits on <html>: the Reader shell tokens live on :root and read it from there.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const description = "A calm educational index of psychology concepts, everyday examples, and reflection prompts.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Psychology Explorer — Quiet Study Archive",
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: "Psychology Explorer", title: "Psychology Explorer — Quiet Study Archive", description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
