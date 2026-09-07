import Image from "next/image";
import { Localized } from "./Localized";

type TimelineItem = {
  kind: "education" | "work";
  marker: string;
  organizationEn: string;
  organizationZh: string;
  roleEn: string;
  roleZh: string;
  dates: string;
  logo?: string;
  logoKey?: string;
};

const timelineItems: TimelineItem[] = [
  {
    kind: "education",
    marker: "🇨🇳",
    organizationEn: "Huazhong University of Science and Technology",
    organizationZh: "华中科技大学",
    roleEn: "Bachelor of Architecture (BArch)",
    roleZh: "建筑学学士 (BArch)",
    dates: "2016–2021",
  },
  {
    kind: "education",
    marker: "🇳🇱",
    organizationEn: "Delft University of Technology",
    organizationZh: "代尔夫特理工大学",
    roleEn: "MSc Design for Interaction · Exchange",
    roleZh: "交互设计 (MSc) · 交换",
    dates: "2023–2024",
  },
  {
    kind: "work",
    marker: "",
    organizationEn: "SenseTime",
    organizationZh: "商汤科技",
    roleEn: "Interaction Designer · Intern",
    roleZh: "交互设计师｜实习",
    dates: "03/2024–09/2024",
    logo: "/media/about-timeline/sensetime.png",
    logoKey: "sensetime",
  },
  {
    kind: "work",
    marker: "",
    organizationEn: "Microsoft",
    organizationZh: "微软",
    roleEn: "Product Designer · Intern",
    roleZh: "产品设计师｜实习",
    dates: "09/2024–01/2025",
    logo: "/media/about-timeline/microsoft.png",
    logoKey: "microsoft",
  },
  {
    kind: "education",
    marker: "🇸🇪",
    organizationEn: "Umeå Institute of Design",
    organizationZh: "于默奥设计学院",
    roleEn: "MFA in Interaction Design",
    roleZh: "交互设计硕士 (MFA)",
    dates: "2022–2025",
  },
  {
    kind: "work",
    marker: "",
    organizationEn: "Li Auto",
    organizationZh: "理想汽车",
    roleEn: "Interaction Designer · Full-time",
    roleZh: "交互设计师｜全职",
    dates: "08/2025–Now",
    logo: "/media/about-timeline/li-auto.png",
    logoKey: "li-auto",
  },
];

export function AboutTimeline() {
  return (
    <div className="about-timeline-wrap">
      <ol className="about-timeline" aria-label="Education and work timeline">
        {timelineItems.map((item) => (
          <li
            key={`${item.organizationEn}-${item.dates}`}
            className="about-timeline-item"
            data-kind={item.kind}
          >
            <article className="about-timeline-card">
              <span className="about-timeline-identity" aria-hidden="true">
                {item.logo ? (
                  <Image
                    className="about-timeline-logo"
                    data-logo={item.logoKey}
                    src={item.logo}
                    alt=""
                    width={44}
                    height={44}
                    unoptimized
                  />
                ) : (
                  <span className="about-timeline-flag">{item.marker}</span>
                )}
              </span>
              <div className="about-timeline-copy">
                <h3><Localized en={item.organizationEn} zh={item.organizationZh} /></h3>
                <p><Localized en={item.roleEn} zh={item.roleZh} /></p>
                <time>{item.dates}</time>
              </div>
            </article>
            <span className="about-timeline-marker" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </div>
  );
}
