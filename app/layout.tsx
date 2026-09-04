import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { AgentationDevtools } from "@/components/AgentationDevtools";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = (
    requestHeaders.get("x-forwarded-host")
    || requestHeaders.get("host")
    || "lexi-liang-portfolio.lexiliang-design.chatgpt.site"
  )
    .split(",")[0]
    .trim();
  const protocol = requestHeaders.get("x-forwarded-proto")
    || (host.startsWith("localhost") ? "http" : "https");
  const siteUrl = `${protocol}://${host}`;
  const socialImage = new URL("/og.png", siteUrl).toString();
  const title = "Lexi Liang — Interaction Designer";
  const description = "I design how humans naturally converse with AI and physical hardware.";

  return {
    title: {
      default: title,
      template: "%s — Lexi Liang",
    },
    description,
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: "Lexi Liang",
      title,
      description,
      images: [{
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "Lexi Liang — interaction designer for AI and physical hardware",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

const preferenceScript = `
(() => {
  try {
    const savedTheme = localStorage.getItem('lexi-theme');
    const savedLanguage = localStorage.getItem('lexi-language');
    document.documentElement.dataset.theme = savedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.lang = savedLanguage || 'en';
    document.documentElement.lang = savedLanguage === 'zh' ? 'zh-CN' : 'en';
  } catch (_) {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.dataset.lang = 'en';
    document.documentElement.lang = 'en';
  }
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferenceScript }} />
        <link
          rel="preload"
          href="/media/cursor-tracker/cursor-sprite.webp"
          as="image"
          type="image/webp"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <a className="skip-link" href="#top">Skip to content</a>
        {children}
        <AgentationDevtools />
      </body>
    </html>
  );
}
