import { Localized } from "./Localized";

export function SectionNarrative({ en, zh, id }: { en: string; zh: string; id: string }) {
  return (
    <h2 id={id} className="section-narrative">
      <span className="section-narrative-motion" data-scroll-reveal="heading">
        <Localized en={en} zh={zh} />
      </span>
    </h2>
  );
}
