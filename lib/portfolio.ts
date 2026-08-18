import portfolioSnapshot from "@/content/portfolio.generated.json";

export type LocalizedLink = {
  label: string;
  href: string;
};

export type ProjectHeading = {
  depth: number;
  label: string;
  id: string;
};

export type PortfolioProject = {
  folder: string;
  slug: string;
  order: number;
  featured: boolean;
  protected: boolean;
  previewOnly: boolean;
  title: string;
  eyebrowEn: string;
  eyebrowZh: string;
  year: string;
  accent: string;
  summaryEn: string;
  summaryZh: string;
  heroEn: string;
  heroZh: string;
  video?: {
    embedUrl: string;
    pageUrl: string;
    title: string;
    aspectRatio: string;
  };
  hasSource: boolean;
  sourceFile: string | null;
  sourceChecksum: string | null;
  status: "in-progress" | "published";
  body: string;
  bodyEn: string;
  bodyZh: string;
  headings: ProjectHeading[];
  headingsEn: ProjectHeading[];
  headingsZh: ProjectHeading[];
};

export const portfolio = portfolioSnapshot as {
  schemaVersion: number;
  site: {
    name: string;
    roleEn: string;
    roleZh: string;
    locationEn: string;
    locationZh: string;
    introEn: string;
    introZh: string;
    current: string;
    currentZh: string;
    previous: string[];
    previousZh: string[];
    contacts: LocalizedLink[];
  };
  projects: PortfolioProject[];
};

export const getProject = (slug: string) =>
  portfolio.projects.find((project) => project.slug === slug);

export const toAnchor = (value: string) => value
  .normalize("NFKC")
  .toLowerCase()
  .replace(/[—–]/g, "-")
  .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
  .replace(/^-+|-+$/g, "") || "section";
