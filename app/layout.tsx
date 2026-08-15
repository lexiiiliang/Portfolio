import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lexi Liang — Interaction Designer",
    template: "%s — Lexi Liang",
  },
  description: "Interaction design portfolio exploring AI products, smart hardware and future human–AI collaboration.",
};

const preferenceScript = `
(() => {
  try {
    const savedTheme = localStorage.getItem('lexi-theme');
    const savedLanguage = localStorage.getItem('lexi-language');
    document.documentElement.dataset.theme = savedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.lang = savedLanguage || 'en';
  } catch (_) {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.dataset.lang = 'en';
  }
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferenceScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <a className="skip-link" href="#top">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
