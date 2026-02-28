import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Bricolage_Grotesque, Cormorant_Garamond } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  title: "LaunchPad - The Cinematic AI Resume Builder",
  description: "Build high-impact, ATS-optimized resumes with cinematic real-time AI guidance.",
  keywords: ["resume builder", "ai resume", "cv maker", "ats optimization", "professional cv"],
  authors: [{ name: "LaunchPad Team" }],
  openGraph: {
    title: "LaunchPad - The Cinematic AI Resume Builder",
    description: "Experience the future of career storytelling with AI.",
    url: "https://launchpad.com",
    siteName: "LaunchPad",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LaunchPad Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchPad - AI Resume Builder",
    description: "Build professional resumes with ease.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://launchpad.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${bricolage.variable} ${cormorant.variable} font-sans antialiased relative`}
      >
        <div className="noise" aria-hidden="true" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
