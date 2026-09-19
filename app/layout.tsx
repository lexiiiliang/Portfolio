import type { Metadata } from "next";
import { Covered_By_Your_Grace } from "next/font/google";
import { AgentationDevtools } from "@/components/AgentationDevtools";
import { CustomCursor } from "@/components/CustomCursor";
import "./globals.css";

const coveredByYourGrace = Covered_By_Your_Grace({
  variable: "--font-covered-by-your-grace",
  subsets: ["latin"],
  weight: "400",
});

// Public metadata is identical for every visitor, so the homepage can be
// generated at build time and served from Vercel's edge cache.
export function generateMetadata(): Metadata {
  const siteUrl = "https://www.lianglezhi.site";
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
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferenceScript }} />
      </head>
      <body className={coveredByYourGrace.variable}>
        <a className="skip-link" href="#top">Skip to content</a>
        {children}
        <CustomCursor />
        <AgentationDevtools />
      </body>
    </html>
  );
}
